/**
 * Record Command - Record user's audio
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'record',
  description: 'Record audio from a specific user in the voice channel',
  usage: 'record <user_id>',
  aliases: ['rec', 'recordaudio'],

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
      const filename = path.join(recordingsDir, `recording_${userId}_${timestamp}.pcm`);

      // Create audio stream
      const audioStream = voiceState.connection.receiver.createStream(userId, {
        mode: 'pcm',
        end: 'manual',
        paddingSilence: true,
      });

      // Create write stream
      const writeStream = fs.createWriteStream(filename);
      audioStream.pipe(writeStream);

      voiceState.audioRecorder = audioStream;
      voiceState.recordingFile = filename;

      await message.channel.send(
        `🎙️ Started recording audio from user \`${userId}\`\nUse \`!stoprecord\` to stop and save.`
      );
      console.log(`🎙️ Recording audio from ${userId} to ${filename}`);
    } catch (error) {
      console.error('Error starting recording:', error);
      await message.channel.send(`❌ Failed to start recording: ${error.message}`);
    }
  },
};
