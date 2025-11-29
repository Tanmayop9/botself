/**
 * Pause Command - Pause current audio playback
 */

module.exports = {
  name: 'pause',
  description: 'Pause current audio playback',
  usage: 'pause',
  aliases: [],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.audioDispatcher) {
      return message.channel.send('❌ Nothing is currently playing.');
    }

    if (voiceState.isPaused) {
      return message.channel.send('⏸️ Playback is already paused.');
    }

    try {
      voiceState.audioDispatcher.pause();
      voiceState.isPaused = true;
      await message.channel.send('⏸️ Playback paused.');
    } catch (error) {
      console.error('Error pausing:', error);
      await message.channel.send(`❌ Failed to pause: ${error.message}`);
    }
  },
};
