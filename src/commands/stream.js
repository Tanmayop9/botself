/**
 * Stream Command - Stream video with screen share
 */

module.exports = {
  name: 'stream',
  description: 'Stream video content with screen share',
  usage: 'stream <video_url>',
  aliases: ['video', 'screenshare', 'ss'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel. Use `!join` first.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a video URL to stream.');
    }

    const url = args.join(' ');

    try {
      await message.channel.send('📺 Setting up stream...');

      // Create stream connection
      const streamConnection = await voiceState.connection.createStreamConnection();
      voiceState.streamConnection = streamConnection;

      // Play video
      const videoDispatcher = streamConnection.playVideo(url, {
        fps: 30,
        bitrate: 2000,
      });

      // Play audio
      const audioDispatcher = streamConnection.playAudio(url);

      voiceState.videoDispatcher = videoDispatcher;
      voiceState.audioDispatcher = audioDispatcher;
      voiceState.isPlaying = true;
      voiceState.currentTrack = { title: 'Video Stream', url };

      // Set volume
      audioDispatcher.setVolume(voiceState.volume);

      videoDispatcher.on('start', () => {
        console.log('📺 Video streaming started');
      });

      videoDispatcher.on('finish', () => {
        console.log('📺 Video streaming finished');
        voiceState.videoDispatcher = null;
      });

      videoDispatcher.on('error', (error) => {
        console.error('Video streaming error:', error);
        message.channel.send(`❌ Video error: ${error.message}`);
      });

      audioDispatcher.on('start', () => {
        console.log('🔊 Audio streaming started');
        message.channel.send('📺 Now streaming video!');
      });

      audioDispatcher.on('finish', () => {
        console.log('🔊 Audio streaming finished');
        voiceState.audioDispatcher = null;
        voiceState.isPlaying = false;
      });

      audioDispatcher.on('error', (error) => {
        console.error('Audio streaming error:', error);
        message.channel.send(`❌ Audio error: ${error.message}`);
      });
    } catch (error) {
      console.error('Error starting stream:', error);
      await message.channel.send(`❌ Failed to start stream: ${error.message}`);
    }
  },
};
