/**
 * Load Queue Command - Load a saved playlist
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'loadqueue',
  description: 'Load a saved playlist into the queue',
  usage: 'loadqueue <name>',
  aliases: ['lq', 'loadplaylist', 'import'],

  async execute(client, message, args, voiceState) {
    if (!voiceState.connection) {
      return message.channel.send('❌ Not connected to a voice channel. Use `!join` first.');
    }

    const playlistsDir = path.join(process.cwd(), 'playlists');

    if (!args[0]) {
      // List available playlists
      if (!fs.existsSync(playlistsDir)) {
        return message.channel.send('❌ No saved playlists found.');
      }

      const files = fs.readdirSync(playlistsDir).filter((f) => f.endsWith('.json'));
      if (files.length === 0) {
        return message.channel.send('❌ No saved playlists found.');
      }

      const list = files.map((f) => `• ${f.replace('.json', '')}`).join('\n');
      return message.channel.send(`📋 **Saved Playlists:**\n${list}\n\nUse \`!loadqueue <name>\` to load one.`);
    }

    const playlistName = args.join('_').replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(playlistsDir, `${playlistName}.json`);

    if (!fs.existsSync(filePath)) {
      return message.channel.send(`❌ Playlist **${args.join(' ')}** not found.`);
    }

    try {
      const playlist = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      if (!playlist.tracks || playlist.tracks.length === 0) {
        return message.channel.send('❌ Playlist is empty.');
      }

      // Add tracks to queue
      voiceState.queue.push(...playlist.tracks);

      await message.channel.send(`📂 Loaded **${playlist.tracks.length}** tracks from playlist: **${playlist.name}**`);

      // Start playing if nothing is playing
      if (!voiceState.isPlaying && voiceState.queue.length > 0) {
        const firstTrack = voiceState.queue.shift();
        const playCommand = require('./play');
        await playCommand.execute(client, message, [firstTrack.url], voiceState);
      }
    } catch (error) {
      console.error('Error loading playlist:', error);
      await message.channel.send('❌ Failed to load playlist.');
    }
  },
};
