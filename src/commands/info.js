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

      // Calculate elapsed time if playing
      let elapsedTime = 'N/A';
      if (voiceState.startTime && voiceState.isPlaying) {
        const elapsed = Math.floor((Date.now() - voiceState.startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        elapsedTime = `${mins}:${secs.toString().padStart(2, '0')}`;
      }

      const info = `
📊 **Voice Connection Info**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Channel:** ${channel?.name || 'Unknown'}
**Channel ID:** ${channel?.id || 'Unknown'}
**Guild:** ${channel?.guild?.name || 'DM/Group'}
**Members:** ${channel?.members?.size || 0}
**Bitrate:** ${channel?.bitrate ? channel.bitrate / 1000 + ' kbps' : 'Unknown'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Playback Status:**
  🎵 Playing: ${voiceState.isPlaying ? 'Yes' : 'No'}
  ⏸️ Paused: ${voiceState.isPaused ? 'Yes' : 'No'}
  ⏱️ Elapsed: ${elapsedTime}
  🔊 Volume: ${Math.round(voiceState.volume * 100)}%
  🔁 Track Loop: ${voiceState.loopMode ? 'On' : 'Off'}
  🔁 Queue Loop: ${voiceState.loopQueue ? 'On' : 'Off'}
  📋 Queue: ${voiceState.queue.length} tracks
  📜 History: ${voiceState.history?.length || 0} tracks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Features:**
  📺 Streaming: ${voiceState.streamConnection ? 'Yes' : 'No'}
  🎙️ Recording Audio: ${voiceState.audioRecorder ? 'Yes' : 'No'}
  📹 Recording Video: ${voiceState.videoRecorder ? 'Yes' : 'No'}
  🔄 24/7 Mode: ${voiceState.afkChannel ? 'On' : 'Off'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Effects:**
  🔊 Bass Boost: ${voiceState.bassBoost ? 'On' : 'Off'}
  🌙 Nightcore: ${voiceState.nightcore ? 'On' : 'Off'}
  ⏩ Speed: ${voiceState.speed || 1.0}x
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      await message.channel.send(info);
    } catch (error) {
      console.error('Error getting info:', error);
      await message.channel.send(`❌ Failed to get info: ${error.message}`);
    }
  },
};
