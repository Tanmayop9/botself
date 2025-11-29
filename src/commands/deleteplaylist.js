/**
 * Delete Playlist Command - Delete a saved playlist
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'deleteplaylist',
  description: 'Delete a saved playlist',
  usage: 'deleteplaylist <name>',
  aliases: ['delplaylist', 'rmplaylist', 'dp'],

  async execute(client, message, args, voiceState) {
    if (!args[0]) {
      return message.channel.send('❌ Please provide the name of the playlist to delete.');
    }

    const playlistsDir = path.join(process.cwd(), 'playlists');
    const playlistName = args.join('_').replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(playlistsDir, `${playlistName}.json`);

    if (!fs.existsSync(filePath)) {
      return message.channel.send(`❌ Playlist **${args.join(' ')}** not found.`);
    }

    try {
      fs.unlinkSync(filePath);
      await message.channel.send(`🗑️ Deleted playlist: **${args.join(' ')}**`);
    } catch (error) {
      console.error('Error deleting playlist:', error);
      await message.channel.send('❌ Failed to delete playlist.');
    }
  },
};
