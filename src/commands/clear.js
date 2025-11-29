/**
 * Clear Command - Clear the queue
 */

module.exports = {
  name: 'clear',
  description: 'Clear all tracks from the queue',
  usage: 'clear',
  aliases: ['clearqueue', 'cq'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (voiceState.queue.length === 0) {
      return message.channel.send('📋 Queue is already empty.');
    }

    const count = voiceState.queue.length;
    voiceState.queue = [];

    await message.channel.send(`🗑️ Cleared ${count} tracks from the queue.`);
  },
};
