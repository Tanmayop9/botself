/**
 * Shuffle Command - Shuffle the queue
 */

module.exports = {
  name: 'shuffle',
  description: 'Shuffle the current queue randomly',
  usage: 'shuffle',
  aliases: ['mix', 'randomize'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (voiceState.queue.length < 2) {
      return message.channel.send('❌ Need at least 2 tracks in queue to shuffle.');
    }

    // Fisher-Yates shuffle algorithm
    for (let i = voiceState.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [voiceState.queue[i], voiceState.queue[j]] = [voiceState.queue[j], voiceState.queue[i]];
    }

    await message.channel.send(`🔀 Shuffled ${voiceState.queue.length} tracks in the queue!`);
  },
};
