/**
 * Mute Command - Toggle server mute
 */

module.exports = {
  name: 'mute',
  description: 'Toggle server mute status',
  usage: 'mute',
  aliases: ['selfmute', 'servermute'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    try {
      const member = message.guild?.members?.cache?.get(client.user.id);
      if (!member?.voice) {
        return message.channel.send('❌ Could not find voice state.');
      }

      const isMuted = member.voice.selfMute;
      await voiceState.connection.setSelfMute(!isMuted);

      const status = !isMuted ? '🔇 Self mute enabled' : '🔊 Self mute disabled';
      await message.channel.send(status);
    } catch (error) {
      console.error('Error toggling mute:', error);
      await message.channel.send(`❌ Failed to toggle mute: ${error.message}`);
    }
  },
};
