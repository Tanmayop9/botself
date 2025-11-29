/**
 * Move Command - Move a track in the queue
 */

module.exports = {
  name: 'move',
  description: 'Move a track from one position to another in the queue',
  usage: 'move <from> <to>',
  aliases: ['mv'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (voiceState.queue.length < 2) {
      return message.channel.send('❌ Need at least 2 tracks in queue to move.');
    }

    if (args.length < 2) {
      return message.channel.send('❌ Usage: `!move <from> <to>` (e.g., `!move 3 1`)');
    }

    const from = parseInt(args[0], 10) - 1;
    const to = parseInt(args[1], 10) - 1;

    if (isNaN(from) || isNaN(to)) {
      return message.channel.send('❌ Please provide valid position numbers.');
    }

    if (from < 0 || from >= voiceState.queue.length || to < 0 || to >= voiceState.queue.length) {
      return message.channel.send(`❌ Invalid positions. Queue has ${voiceState.queue.length} tracks.`);
    }

    const [track] = voiceState.queue.splice(from, 1);
    voiceState.queue.splice(to, 0, track);

    await message.channel.send(`📍 Moved **${track.title}** from position ${from + 1} to ${to + 1}`);
  },
};
