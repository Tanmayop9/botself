/**
 * Now Playing Command - Show current track info
 */

module.exports = {
  name: 'nowplaying',
  description: 'Show information about the currently playing track',
  usage: 'nowplaying',
  aliases: ['np', 'playing', 'current'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.currentTrack || !voiceState.isPlaying) {
      return message.channel.send('❌ Nothing is currently playing.');
    }

    const status = voiceState.isPaused ? '⏸️ Paused' : '▶️ Playing';
    const volumePercent = Math.round(voiceState.volume * 100);
    const loopStatus = voiceState.loopMode ? '🔁 On' : '🔁 Off';

    const info = `
🎵 **Now Playing**
━━━━━━━━━━━━━━━━━━━━━
**Title:** ${voiceState.currentTrack.title}
**Status:** ${status}
**Volume:** ${volumePercent}%
**Loop:** ${loopStatus}
**Queue:** ${voiceState.queue.length} tracks
━━━━━━━━━━━━━━━━━━━━━
`;

    await message.channel.send(info);
  },
};
