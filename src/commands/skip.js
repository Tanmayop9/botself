/**
 * Skip Command - Skip to next track in queue
 */

module.exports = {
  name: 'skip',
  description: 'Skip to the next track in the queue',
  usage: 'skip',
  aliases: ['next', 'sk'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (!voiceState.audioDispatcher && voiceState.queue.length === 0) {
      return message.channel.send('❌ Nothing to skip.');
    }

    try {
      // Destroy current dispatcher (this will trigger the 'finish' event handler)
      if (voiceState.audioDispatcher) {
        const skippedTitle = voiceState.currentTrack?.title || 'Unknown';
        voiceState.audioDispatcher.destroy();
        voiceState.audioDispatcher = null;
        voiceState.isPlaying = false;
        voiceState.isPaused = false;
        voiceState.currentTrack = null;

        await message.channel.send(`⏭️ Skipped: **${skippedTitle}**`);

        // Play next in queue if available
        if (voiceState.queue.length > 0) {
          const nextTrack = voiceState.queue.shift();
          const playCommand = require('./play');
          await playCommand.execute(client, message, [nextTrack.url], voiceState);
        }
      } else if (voiceState.queue.length > 0) {
        const nextTrack = voiceState.queue.shift();
        const playCommand = require('./play');
        await playCommand.execute(client, message, [nextTrack.url], voiceState);
      }
    } catch (error) {
      console.error('Error skipping:', error);
      await message.channel.send(`❌ Failed to skip: ${error.message}`);
    }
  },
};
