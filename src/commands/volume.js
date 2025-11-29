/**
 * Volume Command - Adjust playback volume
 */

module.exports = {
  name: 'volume',
  description: 'Set playback volume (0-200)',
  usage: 'volume <0-200>',
  aliases: ['vol', 'v'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!args[0]) {
      const currentVolume = Math.round(voiceState.volume * 100);
      return message.channel.send(`🔊 Current volume: **${currentVolume}%**`);
    }

    const volume = parseInt(args[0], 10);

    if (isNaN(volume) || volume < 0 || volume > 200) {
      return message.channel.send('❌ Please provide a volume between 0 and 200.');
    }

    try {
      const normalizedVolume = volume / 100;
      voiceState.volume = normalizedVolume;

      if (voiceState.audioDispatcher) {
        voiceState.audioDispatcher.setVolume(normalizedVolume);
      }

      const emoji = volume === 0 ? '🔇' : volume < 50 ? '🔈' : volume < 100 ? '🔉' : '🔊';
      await message.channel.send(`${emoji} Volume set to **${volume}%**`);
    } catch (error) {
      console.error('Error setting volume:', error);
      await message.channel.send(`❌ Failed to set volume: ${error.message}`);
    }
  },
};
