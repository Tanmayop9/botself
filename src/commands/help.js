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
      // Show specific command help
      const CommandHandler = require('../utils/commandHandler');
      const handler = new CommandHandler(client, voiceState);
      const command = handler.commands.get(args[0].toLowerCase());

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
**🎵 Discord VC Selfbot - Commands**

**Voice Channel:**
\`${prefix}join [channel_id]\` - Join a voice channel
\`${prefix}leave\` - Leave the current voice channel
\`${prefix}deaf\` - Toggle server deaf
\`${prefix}mute\` - Toggle server mute

**Audio Playback:**
\`${prefix}play <url/search>\` - Play audio from YouTube or URL
\`${prefix}pause\` - Pause current playback
\`${prefix}resume\` - Resume paused playback
\`${prefix}stop\` - Stop playback and clear queue
\`${prefix}skip\` - Skip to next track in queue
\`${prefix}volume <0-200>\` - Set playback volume
\`${prefix}queue\` - View the current queue
\`${prefix}nowplaying\` - Show current track info
\`${prefix}loop\` - Toggle loop mode

**Video/Streaming:**
\`${prefix}stream <url>\` - Stream video with screen share
\`${prefix}stopstream\` - Stop video streaming

**Recording:**
\`${prefix}record <user_id>\` - Record user's audio
\`${prefix}stoprecord\` - Stop recording
\`${prefix}recordvideo <user_id>\` - Record user's video stream
\`${prefix}stoprecordvideo\` - Stop video recording

**Utility:**
\`${prefix}status <text>\` - Set custom status
\`${prefix}ping\` - Check bot latency
\`${prefix}info\` - Show voice connection info
\`${prefix}help [command]\` - Show this help message

**Tip:** Use \`${prefix}help <command>\` for detailed info about a specific command.
`;

    await message.channel.send(helpText);
  },
};
