/**
 * Join Command - Join a voice channel
 */

module.exports = {
  name: 'join',
  description: 'Join a voice channel',
  usage: 'join [channel_id]',
  aliases: ['j', 'connect'],

  async execute(client, message, args, voiceState) {
    let channel;

    if (args[0]) {
      // Join specified channel by ID
      channel = client.channels.cache.get(args[0]);
      if (!channel) {
        return message.channel.send('❌ Channel not found. Please provide a valid voice channel ID.');
      }
    } else {
      // Try to find user's current voice channel
      const guild = message.guild;
      if (!guild) {
        return message.channel.send('❌ Please provide a voice channel ID or use this command in a server.');
      }

      const member = guild.members.cache.get(client.user.id);
      const voiceChannel = member?.voice?.channel;

      if (!voiceChannel) {
        return message.channel.send('❌ Please provide a voice channel ID or join a voice channel first.');
      }
      channel = voiceChannel;
    }

    // Check if it's a voice channel
    const voiceChannelTypes = ['GUILD_VOICE', 'GUILD_STAGE_VOICE'];
    if (!voiceChannelTypes.includes(channel.type)) {
      return message.channel.send('❌ The specified channel is not a voice channel.');
    }

    try {
      // Leave existing connection if any
      if (voiceState.connection) {
        voiceState.connection.disconnect();
      }

      // Join the voice channel
      const connection = await client.voice.joinChannel(channel, {
        selfMute: false,
        selfDeaf: false,
        selfVideo: false,
      });

      voiceState.connection = connection;
      voiceState.isPlaying = false;
      voiceState.isPaused = false;
      voiceState.queue = [];

      await message.channel.send(`✅ Joined voice channel: **${channel.name}**`);
      console.log(`📥 Joined voice channel: ${channel.name} (${channel.id})`);
    } catch (error) {
      console.error('Error joining voice channel:', error);
      await message.channel.send(`❌ Failed to join voice channel: ${error.message}`);
    }
  },
};
