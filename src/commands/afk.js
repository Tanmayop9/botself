/**
 * AFK Command - Set up AFK mode to auto-rejoin a channel
 */

module.exports = {
  name: 'afk',
  description: 'Set up AFK mode to auto-rejoin a voice channel if disconnected',
  usage: 'afk [channel_id | off]',
  aliases: ['autorejoin', 'stayvc'],

  async execute(client, message, args, voiceState) {
    if (args[0] === 'off' || args[0] === 'disable') {
      voiceState.afkChannel = null;
      return message.channel.send('✅ AFK mode disabled.');
    }

    let channelId = args[0];

    // If no channel ID provided, use current voice channel
    if (!channelId && voiceState.connection) {
      channelId = voiceState.connection.channel?.id;
    }

    if (!channelId) {
      return message.channel.send('❌ Please provide a channel ID or join a voice channel first.');
    }

    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      return message.channel.send('❌ Channel not found.');
    }

    voiceState.afkChannel = channelId;
    await message.channel.send(`✅ AFK mode enabled for **${channel.name}**\nWill auto-rejoin if disconnected.`);
  },
};
