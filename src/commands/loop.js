/**
 * Loop Command - Toggle loop mode
 */

module.exports = {
  name: 'loop',
  description: 'Toggle loop mode for the current track',
  usage: 'loop',
  aliases: ['repeat'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    voiceState.loopMode = !voiceState.loopMode;

    const status = voiceState.loopMode ? '🔁 Loop mode enabled' : '➡️ Loop mode disabled';
    await message.channel.send(status);
  },
};
