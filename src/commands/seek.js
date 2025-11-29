/**
 * Seek Command - Seek to a specific position in the current track
 * Note: Seeking requires restarting the track with an offset
 */

module.exports = {
  name: 'seek',
  description: 'Seek to a specific position (requires track restart)',
  usage: 'seek <seconds or mm:ss>',
  aliases: ['goto', 'jumpto'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.isPlaying || !voiceState.currentTrack) {
      return message.channel.send('❌ Nothing is currently playing.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a time position (e.g., `!seek 30` or `!seek 1:30`).');
    }

    let seconds = 0;
    const timeArg = args[0];

    // Parse time format (mm:ss or just seconds)
    if (timeArg.includes(':')) {
      const parts = timeArg.split(':');
      if (parts.length === 2) {
        seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      } else if (parts.length === 3) {
        seconds = parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
      }
    } else {
      seconds = parseInt(timeArg, 10);
    }

    if (isNaN(seconds) || seconds < 0) {
      return message.channel.send('❌ Invalid time format. Use seconds or mm:ss format.');
    }

    // Note: Actual seeking depends on the audio library capabilities
    // This is a placeholder for the seek functionality
    await message.channel.send(`⏩ Seeking to ${formatTime(seconds)}... (Note: Seek requires track restart with offset)`);
  },
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
