/**
 * Stop Command - Stop playback and clear queue
 */

module.exports = {
  name: 'stop',
  description: 'Stop current playback and clear the queue',
  usage: 'stop',
  aliases: ['s'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    try {
      // Stop audio dispatcher
      if (voiceState.audioDispatcher) {
        voiceState.audioDispatcher.destroy();
        voiceState.audioDispatcher = null;
      }

      // Stop video dispatcher if streaming
      if (voiceState.videoDispatcher) {
        voiceState.videoDispatcher.destroy();
        voiceState.videoDispatcher = null;
      }

      // Clear queue
      voiceState.queue = [];
      voiceState.isPlaying = false;
      voiceState.isPaused = false;
      voiceState.currentTrack = null;

      await message.channel.send('⏹️ Stopped playback and cleared the queue.');
    } catch (error) {
      console.error('Error stopping:', error);
      await message.channel.send(`❌ Failed to stop: ${error.message}`);
    }
  },
};
