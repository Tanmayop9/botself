/**
 * Record Video Command - Record user's video stream
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'recordvideo',
  description: 'Record video stream from a specific user',
  usage: 'recordvideo <user_id>',
  aliases: ['recvideo', 'recordstream'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel. Use `!join` first.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a user ID to record.');
    }

    const userId = args[0];

    try {
      // Create recordings directory if it doesn't exist
      const recordingsDir = path.join(process.cwd(), 'recordings');
      if (!fs.existsSync(recordingsDir)) {
        fs.mkdirSync(recordingsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const filename = path.join(recordingsDir, `video_${userId}_${timestamp}.mkv`);

      // Join the user's stream connection
      const streamConnection = await voiceState.connection.joinStreamConnection(userId);

      // Create video stream
      const videoStream = streamConnection.receiver.createVideoStream(
        userId,
        fs.createWriteStream(filename)
      );

      voiceState.videoRecorder = videoStream;
      voiceState.videoRecordingFile = filename;

      videoStream.on('ready', () => {
        console.log('📹 FFmpeg process ready for video recording');
        message.channel.send(`📹 Started recording video from user \`${userId}\`\nUse \`!stoprecordvideo\` to stop.`);
      });

      console.log(`📹 Recording video from ${userId} to ${filename}`);
    } catch (error) {
      console.error('Error starting video recording:', error);
      await message.channel.send(`❌ Failed to start video recording: ${error.message}`);
    }
  },
};
