/**
 * Resume Command - Resume paused audio playback
 */

module.exports = {
  name: 'resume',
  description: 'Resume paused audio playback',
  usage: 'resume',
  aliases: ['unpause'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.audioDispatcher) {
      return message.channel.send('❌ Nothing is currently playing.');
    }

    if (!voiceState.isPaused) {
      return message.channel.send('▶️ Playback is not paused.');
    }

    try {
      voiceState.audioDispatcher.resume();
      voiceState.isPaused = false;
      await message.channel.send('▶️ Playback resumed.');
    } catch (error) {
      console.error('Error resuming:', error);
      await message.channel.send(`❌ Failed to resume: ${error.message}`);
    }
  },
};
