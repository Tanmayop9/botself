/**
 * Replay Command - Replay the current or previous track
 */

module.exports = {
  name: 'replay',
  description: 'Replay the current track from the beginning',
  usage: 'replay',
  aliases: ['restart', 'again'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.currentTrack) {
      // Try to replay from history
      if (voiceState.history && voiceState.history.length > 0) {
        const lastTrack = voiceState.history[voiceState.history.length - 1];
        const playCommand = require('./play');
        await message.channel.send(`🔄 Replaying last track: **${lastTrack.title}**`);
        return playCommand.execute(client, message, [lastTrack.url], voiceState);
      }
      return message.channel.send('❌ No track to replay.');
    }

    const currentUrl = voiceState.currentTrack.url;
    const currentTitle = voiceState.currentTrack.title;

    // Stop current playback
    if (voiceState.audioDispatcher) {
      voiceState.audioDispatcher.destroy();
      voiceState.audioDispatcher = null;
    }

    await message.channel.send(`🔄 Replaying: **${currentTitle}**`);

    // Replay the track
    const playCommand = require('./play');
    await playCommand.execute(client, message, [currentUrl], voiceState);
  },
};
