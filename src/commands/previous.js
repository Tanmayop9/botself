/**
 * Previous Command - Play the previous track from history
 */

module.exports = {
  name: 'previous',
  description: 'Play the previous track from history',
  usage: 'previous',
  aliases: ['prev', 'back'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.history || voiceState.history.length === 0) {
      return message.channel.send('❌ No previous tracks in history.');
    }

    // Get the last track from history
    const previousTrack = voiceState.history.pop();

    // Add current track to the front of queue if playing
    if (voiceState.currentTrack) {
      voiceState.queue.unshift(voiceState.currentTrack);
    }

    // Stop current playback
    if (voiceState.audioDispatcher) {
      voiceState.audioDispatcher.destroy();
      voiceState.audioDispatcher = null;
    }

    await message.channel.send(`⏮️ Playing previous: **${previousTrack.title}**`);

    // Play the previous track
    const playCommand = require('./play');
    await playCommand.execute(client, message, [previousTrack.url], voiceState);
  },
};
