/**
 * Leave Command - Leave the current voice channel
 */

module.exports = {
  name: 'leave',
  description: 'Leave the current voice channel',
  usage: 'leave',
  aliases: ['l', 'disconnect', 'dc'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to any voice channel.');
    }

    try {
      // Stop all dispatchers
      if (voiceState.audioDispatcher) {
        voiceState.audioDispatcher.destroy();
        voiceState.audioDispatcher = null;
      }

      if (voiceState.videoDispatcher) {
        voiceState.videoDispatcher.destroy();
        voiceState.videoDispatcher = null;
      }

      // Stop recording if active
      if (voiceState.audioRecorder) {
        voiceState.audioRecorder.destroy();
        voiceState.audioRecorder = null;
      }

      if (voiceState.videoRecorder) {
        voiceState.videoRecorder.destroy();
        voiceState.videoRecorder = null;
      }

      // Disconnect from stream connection if exists
      if (voiceState.streamConnection) {
        voiceState.streamConnection = null;
      }

      // Disconnect from voice
      voiceState.connection.disconnect();
      voiceState.connection = null;
      voiceState.isPlaying = false;
      voiceState.isPaused = false;
      voiceState.queue = [];

      await message.channel.send('✅ Left the voice channel.');
      console.log('📤 Left voice channel');
    } catch (error) {
      console.error('Error leaving voice channel:', error);
      await message.channel.send(`❌ Error leaving voice channel: ${error.message}`);
    }
  },
};
