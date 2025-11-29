/**
 * Discord Selfbot VC - Main Entry Point
 * A feature-rich voice channel selfbot with audio/video playback,
 * recording, and streaming capabilities.
 */

require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const CommandHandler = require('./utils/commandHandler');

const client = new Client({
  checkUpdate: false,
});

// Store active voice connections and their dispatchers
const voiceState = {
  connection: null,
  streamConnection: null,
  audioDispatcher: null,
  videoDispatcher: null,
  audioRecorder: null,
  videoRecorder: null,
  isPlaying: false,
  isPaused: false,
  volume: 1.0,
  loopMode: false,
  queue: [],
};

// Initialize command handler
const commandHandler = new CommandHandler(client, voiceState);

// Configuration
const PREFIX = process.env.PREFIX || '!';

client.on('ready', async () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  🎵 Discord VC Selfbot is now online!`);
  console.log(`  📌 Logged in as: ${client.user.tag}`);
  console.log(`  🔧 Prefix: ${PREFIX}`);
  console.log(`  📋 Commands: ${PREFIX}help`);
  console.log('═══════════════════════════════════════════════════════════');

  // Set custom activity if configured
  if (process.env.ACTIVITY_TEXT) {
    client.user.setActivity(process.env.ACTIVITY_TEXT, {
      type: process.env.ACTIVITY_TYPE || 'PLAYING',
    });
  }
});

client.on('messageCreate', async (message) => {
  // Only respond to messages from the selfbot owner
  if (message.author.id !== client.user.id) return;

  // Check for command prefix
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  try {
    await commandHandler.execute(commandName, message, args);
  } catch (error) {
    console.error(`Error executing command ${commandName}:`, error);
    await message.channel.send(`❌ Error: ${error.message}`).catch(() => {});
  }
});

// Voice state update handling
client.on('voiceStateUpdate', (oldState, newState) => {
  // Handle when bot is disconnected from voice
  if (oldState.member?.id === client.user.id && !newState.channelId) {
    console.log('📤 Disconnected from voice channel');
    voiceState.connection = null;
    voiceState.streamConnection = null;
    voiceState.isPlaying = false;
    voiceState.isPaused = false;
    voiceState.queue = [];
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ Error: DISCORD_TOKEN environment variable is not set!');
  console.error('Please create a .env file with your Discord token.');
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error('❌ Failed to login:', error.message);
  process.exit(1);
});
