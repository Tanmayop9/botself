/**
 * Remove Command - Remove a specific track from the queue
 */

module.exports = {
  name: 'remove',
  description: 'Remove a specific track from the queue by position',
  usage: 'remove <position>',
  aliases: ['rm', 'delete'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (voiceState.queue.length === 0) {
      return message.channel.send('❌ Queue is empty.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide the position of the track to remove.');
    }

    const position = parseInt(args[0], 10) - 1;

    if (isNaN(position) || position < 0 || position >= voiceState.queue.length) {
      return message.channel.send(`❌ Invalid position. Queue has ${voiceState.queue.length} tracks.`);
    }

    const [removed] = voiceState.queue.splice(position, 1);

    await message.channel.send(`🗑️ Removed **${removed.title}** from position ${position + 1}`);
  },
};
