/**
 * Playlists Command - List all saved playlists
 */

const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'playlists',
  description: 'List all saved playlists',
  usage: 'playlists',
  aliases: ['pl', 'savedqueues'],

  async execute(client, message, args, voiceState) {
    const playlistsDir = path.join(process.cwd(), 'playlists');

    if (!fs.existsSync(playlistsDir)) {
      return message.channel.send('❌ No saved playlists found.');
    }

    const files = fs.readdirSync(playlistsDir).filter((f) => f.endsWith('.json'));

    if (files.length === 0) {
      return message.channel.send('❌ No saved playlists found.');
    }

    const playlists = files.map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(playlistsDir, f), 'utf8'));
        return {
          name: data.name || f.replace('.json', ''),
          tracks: data.tracks?.length || 0,
          date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Unknown',
        };
      } catch {
        return { name: f.replace('.json', ''), tracks: '?', date: 'Unknown' };
      }
    });

    const list = playlists
      .map((p) => `📁 **${p.name}** - ${p.tracks} tracks (${p.date})`)
      .join('\n');

    await message.channel.send(`📋 **Saved Playlists (${playlists.length}):**\n\n${list}`);
  },
};
