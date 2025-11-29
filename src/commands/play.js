/**
 * Play Command - Play audio from YouTube or URL
 */

const { autoJoinVoiceChannel } = require('../utils/voiceUtils');
const { isYouTubeURL, downloadAudio, deleteFile } = require('../utils/youtubeUtils');

module.exports = {
  name: 'play',
  description: 'Play audio from YouTube URL or other sources',
  usage: 'play <youtube_url or audio_url>',
  aliases: ['p'],

  async execute(client, message, args, voiceState) {
    // Auto-join voice channel if not connected
    if (!voiceState.connection) {
      const joinResult = await autoJoinVoiceChannel(client, message, voiceState);
      if (!joinResult.success) {
        return message.channel.send(`❌ ${joinResult.error}`);
      }
      await message.channel.send(`✅ Auto-joined voice channel: **${joinResult.channel.name}**`);
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a YouTube URL or audio URL.');
    }

    const url = args.join(' ');

    try {
      let audioSource;
      let title = 'Unknown';
      let downloadedFile = null;

      // Check if it's a YouTube URL
      if (isYouTubeURL(url)) {
        const loadingMsg = await message.channel.send('🔄 Downloading audio from YouTube...');
        
        try {
          // Download audio using yt-dlp
          const result = await downloadAudio(url);
          audioSource = result.filePath;
          title = result.title;
          downloadedFile = result.filePath;
          
          await loadingMsg.edit(`🎵 Now playing: **${title}**`);
        } catch (downloadError) {
          console.error('Download error:', downloadError);
          await loadingMsg.edit(`❌ Failed to download: ${downloadError.message}`);
          return;
        }
      } else {
        // Treat as direct URL
        audioSource = url;
        title = url.split('/').pop() || 'Audio Stream';
        await message.channel.send(`🎵 Now playing: **${title}**`);
      }

      // Add previous track to history before playing new one
      if (voiceState.currentTrack) {
        if (!voiceState.history) voiceState.history = [];
        voiceState.history.push(voiceState.currentTrack);
        // Keep only last 50 tracks in history
        if (voiceState.history.length > 50) {
          voiceState.history.shift();
        }
      }

      // Stop previous audio if playing
      if (voiceState.audioDispatcher) {
        voiceState.audioDispatcher.destroy();
      }

      // Delete previous downloaded file if exists
      if (voiceState.currentDownloadedFile) {
        deleteFile(voiceState.currentDownloadedFile);
      }

      // Play the audio
      const dispatcher = voiceState.connection.playAudio(audioSource);

      voiceState.audioDispatcher = dispatcher;
      voiceState.isPlaying = true;
      voiceState.isPaused = false;
      voiceState.currentTrack = { title, url };
      voiceState.currentDownloadedFile = downloadedFile;
      voiceState.startTime = Date.now();

      // Update stats
      if (client.stats) {
        client.stats.tracksPlayed++;
      }

      // Set volume
      dispatcher.setVolume(voiceState.volume);

      dispatcher.on('start', () => {
        console.log(`▶️ Playing: ${title}`);
      });

      dispatcher.on('finish', async () => {
        console.log(`⏹️ Finished: ${title}`);
        voiceState.isPlaying = false;
        voiceState.audioDispatcher = null;

        // Delete downloaded file after playback
        if (voiceState.currentDownloadedFile) {
          deleteFile(voiceState.currentDownloadedFile);
          voiceState.currentDownloadedFile = null;
        }

        // Check for loop mode first (before clearing currentTrack)
        if (voiceState.loopMode && voiceState.currentTrack) {
          const loopUrl = voiceState.currentTrack.url;
          voiceState.currentTrack = null;
          await this.execute(client, message, [loopUrl], voiceState);
        } else if (voiceState.queue.length > 0) {
          // Add current track back to end of queue if queue loop is enabled
          if (voiceState.loopQueue && voiceState.currentTrack) {
            voiceState.queue.push({ ...voiceState.currentTrack });
          }
          voiceState.currentTrack = null;
          const nextTrack = voiceState.queue.shift();
          await this.execute(client, message, [nextTrack.url], voiceState);
        } else {
          voiceState.currentTrack = null;
          voiceState.startTime = null;
        }
      });

      dispatcher.on('error', (error) => {
        console.error('Audio playback error:', error);
        message.channel.send(`❌ Playback error: ${error.message}`);
        voiceState.isPlaying = false;
        voiceState.audioDispatcher = null;
        
        // Delete downloaded file on error
        if (voiceState.currentDownloadedFile) {
          deleteFile(voiceState.currentDownloadedFile);
          voiceState.currentDownloadedFile = null;
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      await message.channel.send(`❌ Failed to play audio: ${error.message}`);
    }
  },
};
