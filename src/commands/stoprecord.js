/**
 * Stop Record Command - Stop audio recording
 */

module.exports = {
  name: 'stoprecord',
  description: 'Stop the current audio recording',
  usage: 'stoprecord',
  aliases: ['stoprec', 'endrec'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.audioRecorder) {
      return message.channel.send('❌ No active audio recording.');
    }

    try {
      voiceState.audioRecorder.destroy();
      const filename = voiceState.recordingFile || 'Unknown';

      voiceState.audioRecorder = null;
      voiceState.recordingFile = null;

      await message.channel.send(`🎙️ Recording stopped.\n📁 Saved to: \`${filename}\``);
      console.log(`🎙️ Recording stopped and saved to ${filename}`);
    } catch (error) {
      console.error('Error stopping recording:', error);
      await message.channel.send(`❌ Failed to stop recording: ${error.message}`);
    }
  },
};
