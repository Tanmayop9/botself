/**
 * Loop Queue Command - Toggle queue loop mode
 */

module.exports = {
  name: 'loopqueue',
  description: 'Toggle loop mode for the entire queue',
  usage: 'loopqueue',
  aliases: ['lq', 'queueloop', 'loopall'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    voiceState.loopQueue = !voiceState.loopQueue;

    // Disable single track loop if enabling queue loop
    if (voiceState.loopQueue && voiceState.loopMode) {
      voiceState.loopMode = false;
    }

    const status = voiceState.loopQueue ? '🔁 Queue loop enabled' : '➡️ Queue loop disabled';
    await message.channel.send(status);
  },
};
