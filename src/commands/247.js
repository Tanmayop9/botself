/**
 * 24/7 Command - Toggle 24/7 mode (stay in voice channel indefinitely)
 */

module.exports = {
  name: '247',
  description: 'Toggle 24/7 mode to stay in voice channel',
  usage: '247',
  aliases: ['twentyfourseven', 'stay', 'permanent'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    // Toggle 24/7 mode by setting AFK channel
    if (voiceState.afkChannel) {
      voiceState.afkChannel = null;
      return message.channel.send('❌ 24/7 mode disabled. Bot will disconnect normally.');
    }

    voiceState.afkChannel = voiceState.connection.channel?.id;
    await message.channel.send(`✅ 24/7 mode enabled! Bot will stay in **${voiceState.connection.channel?.name}** and auto-rejoin if disconnected.`);
  },
};
