/**
 * Grab Command - Get the current track info and URL
 */

module.exports = {
  name: 'grab',
  description: 'Get the current track URL and info',
  usage: 'grab',
  aliases: ['np-url', 'geturl', 'trackinfo'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.currentTrack) {
      return message.channel.send('❌ Nothing is currently playing.');
    }

    const track = voiceState.currentTrack;

    const info = `
🎵 **Track Info**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Title:** ${track.title}
**URL:** ${track.url}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    await message.channel.send(info);
  },
};
