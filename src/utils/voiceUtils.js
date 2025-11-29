/**
 * Voice Channel Utilities - Shared functions for voice channel operations
 */

/**
 * Auto-join voice channel if not already connected
 * @param {Client} client - Discord client
 * @param {Message} message - Discord message
 * @param {Object} voiceState - Voice state object
 * @returns {Promise<{success: boolean, error?: string, channel?: VoiceChannel}>}
 */
const autoJoinVoiceChannel = async (client, message, voiceState) => {
  const guild = message.guild;
  if (!guild) {
    return { success: false, error: 'This command can only be used in a server.' };
  }

  // Find a voice channel to join - check all members for voice state
  let targetChannel = null;

  // First, try to find message author's voice channel
  const member = guild.members.cache.get(message.author.id);
  if (member?.voice?.channel) {
    targetChannel = member.voice.channel;
  }

  // If author not in voice, try to find bot's current voice channel
  if (!targetChannel) {
    const botMember = guild.members.cache.get(client.user.id);
    if (botMember?.voice?.channel) {
      targetChannel = botMember.voice.channel;
    }
  }

  if (!targetChannel) {
    return { success: false, error: 'Please join a voice channel first, or provide a channel ID.' };
  }

  try {
    // Leave existing connection if any
    if (voiceState.connection) {
      voiceState.connection.disconnect();
    }

    // Join the voice channel
    const connection = await client.voice.joinChannel(targetChannel, {
      selfMute: false,
      selfDeaf: false,
      selfVideo: false,
    });

    voiceState.connection = connection;
    voiceState.isPlaying = false;
    voiceState.isPaused = false;

    console.log(`📥 Auto-joined voice channel: ${targetChannel.name} (${targetChannel.id})`);
    return { success: true, channel: targetChannel };
  } catch (error) {
    console.error('Error auto-joining voice channel:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  autoJoinVoiceChannel,
};
