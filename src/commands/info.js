/**
 * Info Command - Show voice connection info
 */

module.exports = {
  name: 'info',
  description: 'Show current voice connection information',
  usage: 'info',
  aliases: ['voiceinfo', 'vcinfo'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to any voice channel.');
    }

    try {
      const connection = voiceState.connection;
      const channel = connection.channel;

      const info = `
📊 **Voice Connection Info**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Channel:** ${channel?.name || 'Unknown'}
**Channel ID:** ${channel?.id || 'Unknown'}
**Guild:** ${channel?.guild?.name || 'DM/Group'}
**Members:** ${channel?.members?.size || 0}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Status:**
  🎵 Playing: ${voiceState.isPlaying ? 'Yes' : 'No'}
  ⏸️ Paused: ${voiceState.isPaused ? 'Yes' : 'No'}
  🔊 Volume: ${Math.round(voiceState.volume * 100)}%
  🔁 Loop: ${voiceState.loopMode ? 'On' : 'Off'}
  📋 Queue: ${voiceState.queue.length} tracks
  📺 Streaming: ${voiceState.streamConnection ? 'Yes' : 'No'}
  🎙️ Recording Audio: ${voiceState.audioRecorder ? 'Yes' : 'No'}
  📹 Recording Video: ${voiceState.videoRecorder ? 'Yes' : 'No'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      await message.channel.send(info);
    } catch (error) {
      console.error('Error getting info:', error);
      await message.channel.send(`❌ Failed to get info: ${error.message}`);
    }
  },
};
