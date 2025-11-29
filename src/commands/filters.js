/**
 * Filters Command - Show and toggle audio filters
 * Note: Filters require FFmpeg audio processing and apply to next track
 */

module.exports = {
  name: 'filters',
  description: 'Show or toggle audio filters (experimental - applies to next track)',
  usage: 'filters [bassboost|nightcore|off]',
  aliases: ['filter', 'fx', 'effects'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!args[0]) {
      // Show current filters
      const filters = [];
      if (voiceState.bassBoost) filters.push('🔊 Bass Boost');
      if (voiceState.nightcore) filters.push('🌙 Nightcore');
      if (voiceState.speed && voiceState.speed !== 1.0) filters.push(`⏩ Speed ${voiceState.speed}x`);

      const status = filters.length > 0 ? filters.join('\n') : 'No active filters';
      return message.channel.send(`🎛️ **Active Filters:**\n${status}\n\nAvailable: \`bassboost\`, \`nightcore\`, \`off\``);
    }

    const filter = args[0].toLowerCase();

    switch (filter) {
      case 'bassboost':
      case 'bass':
        voiceState.bassBoost = !voiceState.bassBoost;
        await message.channel.send(voiceState.bassBoost ? '🔊 Bass Boost enabled' : '🔊 Bass Boost disabled');
        break;

      case 'nightcore':
      case 'nc':
        voiceState.nightcore = !voiceState.nightcore;
        await message.channel.send(voiceState.nightcore ? '🌙 Nightcore enabled' : '🌙 Nightcore disabled');
        break;

      case 'off':
      case 'clear':
      case 'reset':
        voiceState.bassBoost = false;
        voiceState.nightcore = false;
        voiceState.speed = 1.0;
        await message.channel.send('🎛️ All filters disabled');
        break;

      default:
        await message.channel.send('❌ Unknown filter. Available: `bassboost`, `nightcore`, `off`');
    }

    await message.channel.send('⚠️ Note: Filter changes apply to the next track.');
  },
};
