/**
 * Deaf Command - Toggle server deaf
 */

module.exports = {
  name: 'deaf',
  description: 'Toggle server deaf status',
  usage: 'deaf',
  aliases: ['deafen', 'serverdeaf'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    try {
      const member = message.guild?.members?.cache?.get(client.user.id);
      if (!member?.voice) {
        return message.channel.send('❌ Could not find voice state.');
      }

      const isDeaf = member.voice.selfDeaf;
      await voiceState.connection.setSelfDeaf(!isDeaf);

      const status = !isDeaf ? '🔇 Server deaf enabled' : '🔊 Server deaf disabled';
      await message.channel.send(status);
    } catch (error) {
      console.error('Error toggling deaf:', error);
      await message.channel.send(`❌ Failed to toggle deaf: ${error.message}`);
    }
  },
};
