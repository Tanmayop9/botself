/**
 * Stats Command - Show bot statistics
 */

module.exports = {
  name: 'stats',
  description: 'Show bot statistics and system info',
  usage: 'stats',
  aliases: ['statistics', 'botinfo'],

  async execute(client, message, args, voiceState) {
    const uptime = Date.now() - client.stats.uptime;
    const uptimeStr = formatUptime(uptime);

    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);

    const stats = `
📊 **Bot Statistics**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Uptime:** ${uptimeStr}
**Commands Executed:** ${client.stats.commandsExecuted}
**Tracks Played:** ${client.stats.tracksPlayed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Memory Usage:** ${memUsedMB} MB / ${memTotalMB} MB
**Node.js Version:** ${process.version}
**Platform:** ${process.platform}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Servers:** ${client.guilds.cache.size}
**Channels:** ${client.channels.cache.size}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    await message.channel.send(stats);
  },
};

function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}
