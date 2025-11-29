/**
 * Bitrate Command - Display or change channel bitrate
 */

module.exports = {
  name: 'bitrate',
  description: 'Display the current voice channel bitrate',
  usage: 'bitrate',
  aliases: ['br', 'quality'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    const channel = voiceState.connection.channel;
    if (!channel) {
      return message.channel.send('❌ Could not get channel info.');
    }

    const bitrate = channel.bitrate / 1000;
    const maxBitrate = channel.guild?.premiumTier === 3 ? 384 : 
                       channel.guild?.premiumTier === 2 ? 256 :
                       channel.guild?.premiumTier === 1 ? 128 : 96;

    await message.channel.send(`🎚️ **Channel Bitrate:** ${bitrate} kbps\n📊 **Max Bitrate:** ${maxBitrate} kbps (Server Boost Level ${channel.guild?.premiumTier || 0})`);
  },
};
