/**
 * Stop Record Video Command - Stop video recording
 */

module.exports = {
  name: 'stoprecordvideo',
  description: 'Stop the current video recording',
  usage: 'stoprecordvideo',
  aliases: ['stoprecvideo', 'endrecvideo'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.videoRecorder) {
      return message.channel.send('❌ No active video recording.');
    }

    try {
      voiceState.videoRecorder.destroy();
      const filename = voiceState.videoRecordingFile || 'Unknown';

      voiceState.videoRecorder = null;
      voiceState.videoRecordingFile = null;

      await message.channel.send(`📹 Video recording stopped.\n📁 Saved to: \`${filename}\``);
      console.log(`📹 Video recording stopped and saved to ${filename}`);
    } catch (error) {
      console.error('Error stopping video recording:', error);
      await message.channel.send(`❌ Failed to stop video recording: ${error.message}`);
    }
  },
};
