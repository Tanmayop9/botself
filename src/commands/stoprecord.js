/**
 * Stop Record Command - Stop audio recording
 */

const fs = require('fs');
const path = require('path');

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

      await message.channel.send(`🎙️ Recording stopped.\n📁 Processing file...`);
      console.log(`🎙️ Recording stopped and saved to ${filename}`);

      // Check if file exists and send to channel
      if (filename && fs.existsSync(filename)) {
        try {
          const stats = fs.statSync(filename);
          const fileSizeInMB = stats.size / (1024 * 1024);

          // Check if file is within Discord's file size limit (8MB for non-nitro)
          if (fileSizeInMB > 8) {
            await message.channel.send(`⚠️ Recording file is too large (${fileSizeInMB.toFixed(2)}MB) to upload to Discord.\n📁 File saved locally: \`${filename}\``);
          } else if (stats.size === 0) {
            await message.channel.send('⚠️ Recording file is empty (no audio captured).');
            // Delete empty file
            fs.unlinkSync(filename);
            console.log(`🗑️ Deleted empty recording file: ${filename}`);
          } else {
            // Send file to channel
            await message.channel.send({
              content: '🎙️ Here is your recording:',
              files: [{
                attachment: filename,
                name: path.basename(filename),
              }],
            });
            console.log(`📤 Sent recording file to channel: ${filename}`);

            // Delete file from storage after sending
            fs.unlinkSync(filename);
            console.log(`🗑️ Deleted recording file: ${filename}`);
          }
        } catch (uploadError) {
          console.error('Error uploading/deleting recording:', uploadError);
          await message.channel.send(`⚠️ Could not upload recording: ${uploadError.message}\n📁 File saved locally: \`${filename}\``);
        }
      } else {
        await message.channel.send('⚠️ Recording file not found.');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      await message.channel.send(`❌ Failed to stop recording: ${error.message}`);
    }
  },
};
