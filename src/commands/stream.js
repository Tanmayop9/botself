/**
 * Stream Command - Stream video with screen share
 */

const { autoJoinVoiceChannel } = require('../utils/voiceUtils');
const { isYouTubeURL, downloadVideo, deleteFile } = require('../utils/youtubeUtils');

module.exports = {
  name: 'stream',
  description: 'Stream video content with screen share',
  usage: 'stream <video_url>',
  aliases: ['video', 'screenshare', 'ss'],

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
      return message.channel.send('❌ Please provide a video URL to stream.');
    }

    const url = args.join(' ');

    try {
      let videoSource = url;
      let title = 'Video Stream';
      let downloadedFile = null;

      // For YouTube URLs, download the video first
      if (isYouTubeURL(url)) {
        const loadingMsg = await message.channel.send('📺 Downloading video from YouTube... This may take a moment.');
        
        try {
          const result = await downloadVideo(url);
          videoSource = result.filePath;
          title = result.title;
          downloadedFile = result.filePath;
          
          await loadingMsg.edit(`📺 Setting up stream: **${title}**`);
        } catch (downloadError) {
          console.error('Video download error:', downloadError);
          await loadingMsg.edit(`❌ Failed to download video: ${downloadError.message}`);
          return;
        }
      } else {
        await message.channel.send('📺 Setting up stream...');
      }

      // Create stream connection for screen share
      const streamConnection = await voiceState.connection.createStreamConnection();
      voiceState.streamConnection = streamConnection;

      // Delete previous downloaded file if exists
      if (voiceState.currentDownloadedFile) {
        deleteFile(voiceState.currentDownloadedFile);
      }

      // Play video with proper options
      const videoDispatcher = streamConnection.playVideo(videoSource, {
        fps: 30,
        bitrate: 2000,
        hwAccel: false,
        presetH26x: 'ultrafast',
      });

      // Play audio from the same source
      const audioDispatcher = streamConnection.playAudio(videoSource);

      voiceState.videoDispatcher = videoDispatcher;
      voiceState.audioDispatcher = audioDispatcher;
      voiceState.isPlaying = true;
      voiceState.isPaused = false;
      voiceState.currentTrack = { title, url };
      voiceState.currentDownloadedFile = downloadedFile;

      // Set volume
      audioDispatcher.setVolume(voiceState.volume);

      videoDispatcher.on('start', () => {
        console.log('📺 Video streaming started');
        message.channel.send(`📺 Now streaming: **${title}**`);
      });

      videoDispatcher.on('finish', () => {
        console.log('📺 Video streaming finished');
        voiceState.videoDispatcher = null;
        voiceState.isPlaying = false;
        message.channel.send('📺 Video stream finished.');
        
        // Delete downloaded file after playback
        if (voiceState.currentDownloadedFile) {
          deleteFile(voiceState.currentDownloadedFile);
          voiceState.currentDownloadedFile = null;
        }
      });

      videoDispatcher.on('error', (error) => {
        console.error('Video streaming error:', error);
        message.channel.send(`❌ Video error: ${error.message}`);
        voiceState.videoDispatcher = null;
        voiceState.isPlaying = false;
        
        // Delete downloaded file on error
        if (voiceState.currentDownloadedFile) {
          deleteFile(voiceState.currentDownloadedFile);
          voiceState.currentDownloadedFile = null;
        }
      });

      // Handle paused state for video
      videoDispatcher.on('pause', () => {
        console.log('📺 Video stream paused');
        voiceState.isPaused = true;
        message.channel.send('⏸️ Stream paused. Use `!resume` to continue.');
      });

      videoDispatcher.on('resume', () => {
        console.log('📺 Video stream resumed');
        voiceState.isPaused = false;
        message.channel.send('▶️ Stream resumed.');
      });

      audioDispatcher.on('start', () => {
        console.log('🔊 Audio streaming started');
      });

      audioDispatcher.on('finish', () => {
        console.log('🔊 Audio streaming finished');
        voiceState.audioDispatcher = null;
      });

      audioDispatcher.on('error', (error) => {
        console.error('Audio streaming error:', error);
        message.channel.send(`❌ Audio error: ${error.message}`);
        voiceState.audioDispatcher = null;
      });

      // Handle paused state for audio
      audioDispatcher.on('pause', () => {
        console.log('🔊 Audio stream paused');
        voiceState.isPaused = true;
      });

      audioDispatcher.on('resume', () => {
        console.log('🔊 Audio stream resumed');
        voiceState.isPaused = false;
      });
    } catch (error) {
      console.error('Error starting stream:', error);
      await message.channel.send(`❌ Failed to start stream: ${error.message}`);
      voiceState.isPlaying = false;
      voiceState.isPaused = false;
      
      // Delete downloaded file on error
      if (voiceState.currentDownloadedFile) {
        deleteFile(voiceState.currentDownloadedFile);
        voiceState.currentDownloadedFile = null;
      }
    }
  },
};
