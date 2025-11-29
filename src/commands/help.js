/**
 * Help Command - Display all available commands
 */

module.exports = {
  name: 'help',
  description: 'Display all available commands',
  usage: 'help [command]',
  aliases: ['h', 'commands'],

  async execute(client, message, args, voiceState) {
    const prefix = process.env.PREFIX || '!';

    if (args[0]) {
      // Show specific command help by loading command files directly
      const fs = require('fs');
      const path = require('path');
      const commandsPath = path.join(__dirname);
      const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
      
      let command = null;
      for (const file of commandFiles) {
        const cmd = require(path.join(commandsPath, file));
        if (cmd.name === args[0].toLowerCase() || cmd.aliases?.includes(args[0].toLowerCase())) {
          command = cmd;
          break;
        }
      }

      if (!command) {
        return message.channel.send(`❌ Command \`${args[0]}\` not found.`);
      }

      const embed = {
        color: 0x5865f2,
        title: `📖 Command: ${command.name}`,
        fields: [
          { name: 'Description', value: command.description || 'No description', inline: false },
          { name: 'Usage', value: `\`${prefix}${command.usage || command.name}\``, inline: true },
          { name: 'Aliases', value: command.aliases?.join(', ') || 'None', inline: true },
        ],
      };

      return message.channel.send({ embeds: [embed] });
    }

    // Show all commands
    const helpText = `
**🎵 Discord VC Selfbot - Advanced Commands**

**Voice Channel:**
\`${prefix}join [channel_id]\` - Join a voice channel
\`${prefix}leave\` - Leave the current voice channel
\`${prefix}deaf\` - Toggle server deaf
\`${prefix}mute\` - Toggle server mute
\`${prefix}247\` - Toggle 24/7 mode (auto-rejoin)
\`${prefix}afk [channel_id|off]\` - Set AFK auto-rejoin channel

**Audio Playback:**
\`${prefix}play <url>\` - Play audio from YouTube or URL
\`${prefix}pause\` - Pause playback
\`${prefix}resume\` - Resume playback
\`${prefix}stop\` - Stop and clear queue
\`${prefix}skip\` - Skip to next track
\`${prefix}previous\` - Play previous track
\`${prefix}replay\` - Replay current track
\`${prefix}seek <time>\` - Seek to position
\`${prefix}volume <0-200>\` - Set volume
\`${prefix}loop\` - Toggle track loop
\`${prefix}loopqueue\` - Toggle queue loop

**Queue Management:**
\`${prefix}queue\` - View queue
\`${prefix}add <url>\` - Add to queue
\`${prefix}remove <pos>\` - Remove from queue
\`${prefix}move <from> <to>\` - Move track position
\`${prefix}shuffle\` - Shuffle queue
\`${prefix}clear\` - Clear queue
\`${prefix}nowplaying\` - Current track info
\`${prefix}grab\` - Get current track URL

**Playlists:**
\`${prefix}savequeue <name>\` - Save queue as playlist
\`${prefix}loadqueue <name>\` - Load a playlist
\`${prefix}playlists\` - List saved playlists
\`${prefix}deleteplaylist <name>\` - Delete a playlist

**Audio Effects:**
\`${prefix}filters [type]\` - Toggle audio filters
\`${prefix}speed <0.5-2.0>\` - Set playback speed
\`${prefix}bitrate\` - Show channel bitrate

**Video/Streaming:**
\`${prefix}stream <url>\` - Stream video (screen share)
\`${prefix}stopstream\` - Stop streaming

**Recording:**
\`${prefix}record <user_id>\` - Record user audio
\`${prefix}stoprecord\` - Stop audio recording
\`${prefix}recordvideo <user_id>\` - Record user video
\`${prefix}stoprecordvideo\` - Stop video recording

**Utility:**
\`${prefix}ping\` - Check latency
\`${prefix}info\` - Voice connection info
\`${prefix}stats\` - Bot statistics
\`${prefix}help [cmd]\` - Show help

Use \`${prefix}help <command>\` for detailed info.
`;

    await message.channel.send(helpText);
  },
};
