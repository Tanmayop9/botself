/**
 * Stop Stream Command - Stop video streaming
 */

module.exports = {
  name: 'stopstream',
  description: 'Stop video streaming',
  usage: 'stopstream',
  aliases: ['endstream', 'stopvideo'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.streamConnection && !voiceState.videoDispatcher) {
      return message.channel.send('❌ No active stream to stop.');
    }

    try {
      // Stop video dispatcher
      if (voiceState.videoDispatcher) {
        voiceState.videoDispatcher.destroy();
        voiceState.videoDispatcher = null;
      }

      // Stop audio dispatcher
      if (voiceState.audioDispatcher) {
        voiceState.audioDispatcher.destroy();
        voiceState.audioDispatcher = null;
      }

      voiceState.streamConnection = null;
      voiceState.isPlaying = false;
      voiceState.currentTrack = null;

      await message.channel.send('📺 Stream stopped.');
    } catch (error) {
      console.error('Error stopping stream:', error);
      await message.channel.send(`❌ Failed to stop stream: ${error.message}`);
    }
  },
};
