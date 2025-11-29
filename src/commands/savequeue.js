/**
 * Save Queue Command - Save the current queue to a named playlist
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'savequeue',
  description: 'Save the current queue as a playlist',
  usage: 'savequeue <name>',
  aliases: ['sq', 'saveplaylist', 'export'],

  async execute(client, message, args, voiceState) {
    if (voiceState.queue.length === 0 && !voiceState.currentTrack) {
      return message.channel.send('❌ No tracks to save. Queue is empty.');
    }

    if (!args[0]) {
      return message.channel.send('❌ Please provide a name for the playlist.');
    }

    const playlistName = args.join('_').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!playlistName) {
      return message.channel.send('❌ Invalid playlist name.');
    }

    // Create playlists directory
    const playlistsDir = path.join(process.cwd(), 'playlists');
    if (!fs.existsSync(playlistsDir)) {
      fs.mkdirSync(playlistsDir, { recursive: true });
    }

    // Build playlist
    const playlist = {
      name: args.join(' '),
      createdAt: new Date().toISOString(),
      tracks: [],
    };

    // Add current track if playing
    if (voiceState.currentTrack) {
      playlist.tracks.push(voiceState.currentTrack);
    }

    // Add queue tracks
    playlist.tracks.push(...voiceState.queue);

    // Save to file
    const filePath = path.join(playlistsDir, `${playlistName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(playlist, null, 2));

    await message.channel.send(`💾 Saved ${playlist.tracks.length} tracks to playlist: **${args.join(' ')}**`);
  },
};
