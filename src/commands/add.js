/**
 * Add Command - Add a track to the queue
 */

const ytdl = require('@distube/ytdl-core');

module.exports = {
  name: 'add',
  description: 'Add a track to the queue without playing immediately',
  usage: 'add <youtube_url>',
  aliases: ['enqueue', 'addqueue'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel. Use `!join` first.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a YouTube URL to add to the queue.');
    }

    const url = args.join(' ');

    try {
      let title = url;

      // Get video info if YouTube URL
      if (ytdl.validateURL(url)) {
        const info = await ytdl.getInfo(url);
        title = info.videoDetails.title;
      }

      voiceState.queue.push({ title, url });

      await message.channel.send(`➕ Added to queue: **${title}**\n📋 Position: ${voiceState.queue.length}`);
    } catch (error) {
      console.error('Error adding to queue:', error);
      await message.channel.send(`❌ Failed to add to queue: ${error.message}`);
    }
  },
};
