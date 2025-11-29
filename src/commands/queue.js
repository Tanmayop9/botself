/**
 * Queue Command - View and manage the queue
 */

module.exports = {
  name: 'queue',
  description: 'View the current playback queue',
  usage: 'queue',
  aliases: ['q'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel.');
    }

    if (voiceState.queue.length === 0) {
      let statusMsg = '📋 **Queue is empty.**';
      if (voiceState.currentTrack) {
        statusMsg += `\n\n🎵 Currently playing: **${voiceState.currentTrack.title}**`;
      }
      return message.channel.send(statusMsg);
    }

    let queueList = voiceState.queue
      .slice(0, 10)
      .map((track, index) => `${index + 1}. ${track.title}`)
      .join('\n');

    if (voiceState.queue.length > 10) {
      queueList += `\n... and ${voiceState.queue.length - 10} more tracks`;
    }

    let response = `📋 **Queue (${voiceState.queue.length} tracks)**\n\n${queueList}`;

    if (voiceState.currentTrack) {
      response = `🎵 **Now Playing:** ${voiceState.currentTrack.title}\n\n` + response;
    }

    await message.channel.send(response);
  },
};
