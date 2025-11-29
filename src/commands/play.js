/**
 * Play Command - Play audio from YouTube or URL
 */

const ytdl = require('@distube/ytdl-core');

module.exports = {
  name: 'play',
  description: 'Play audio from YouTube URL or other sources',
  usage: 'play <youtube_url or audio_url>',
  aliases: ['p'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel. Use `!join` first.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a YouTube URL or audio URL.');
    }

    const url = args.join(' ');

    try {
      let audioSource;
      let title = 'Unknown';

      // Check if it's a YouTube URL
      if (ytdl.validateURL(url)) {
        const info = await ytdl.getInfo(url);
        title = info.videoDetails.title;
        audioSource = ytdl(url, {
          quality: 'highestaudio',
          filter: 'audioonly',
        });
        await message.channel.send(`🎵 Now playing: **${title}**`);
      } else {
        // Treat as direct URL
        audioSource = url;
        title = url.split('/').pop() || 'Audio Stream';
        await message.channel.send(`🎵 Now playing: **${title}**`);
      }

      // Stop previous audio if playing
      if (voiceState.audioDispatcher) {
        voiceState.audioDispatcher.destroy();
      }

      // Play the audio
      const dispatcher = voiceState.connection.playAudio(audioSource);

      voiceState.audioDispatcher = dispatcher;
      voiceState.isPlaying = true;
      voiceState.isPaused = false;
      voiceState.currentTrack = { title, url };

      // Set volume
      dispatcher.setVolume(voiceState.volume);

      dispatcher.on('start', () => {
        console.log(`▶️ Playing: ${title}`);
      });

      dispatcher.on('finish', async () => {
        console.log(`⏹️ Finished: ${title}`);
        voiceState.isPlaying = false;
        voiceState.audioDispatcher = null;

        // Check for loop mode first (before clearing currentTrack)
        if (voiceState.loopMode && voiceState.currentTrack) {
          const loopUrl = voiceState.currentTrack.url;
          voiceState.currentTrack = null;
          await this.execute(client, message, [loopUrl], voiceState);
        } else if (voiceState.queue.length > 0) {
          // Check for queue
          voiceState.currentTrack = null;
          const nextTrack = voiceState.queue.shift();
          await this.execute(client, message, [nextTrack.url], voiceState);
        } else {
          voiceState.currentTrack = null;
        }
      });

      dispatcher.on('error', (error) => {
        console.error('Audio playback error:', error);
        message.channel.send(`❌ Playback error: ${error.message}`);
        voiceState.isPlaying = false;
        voiceState.audioDispatcher = null;
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      await message.channel.send(`❌ Failed to play audio: ${error.message}`);
    }
  },
};
