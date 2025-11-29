/**
 * Speed Command - Adjust playback speed (experimental feature)
 * Note: Requires FFmpeg audio processing and applies to next track
 */

module.exports = {
  name: 'speed',
  description: 'Adjust playback speed (experimental - applies to next track)',
  usage: 'speed <0.5-2.0>',
  aliases: ['tempo', 'rate'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!args[0]) {
      const currentSpeed = voiceState.speed || 1.0;
      return message.channel.send(`⏩ Current speed: **${currentSpeed}x**`);
    }

    const speed = parseFloat(args[0]);

    if (isNaN(speed) || speed < 0.5 || speed > 2.0) {
      return message.channel.send('❌ Please provide a speed between 0.5 and 2.0');
    }

    voiceState.speed = speed;
    await message.channel.send(`⏩ Playback speed set to **${speed}x**\n⚠️ Note: Speed changes apply to next track.`);
  },
};
