/**
 * Command Handler - Manages all bot commands
 */

const fs = require('fs');
const path = require('path');

class CommandHandler {
  constructor(client, voiceState) {
    this.client = client;
    this.voiceState = voiceState;
    this.commands = new Map();
    this.loadCommands();
  }

  loadCommands() {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, file));
      this.commands.set(command.name, command);

      // Register aliases
      if (command.aliases) {
        for (const alias of command.aliases) {
          this.commands.set(alias, command);
        }
      }
    }

    console.log(`📋 Loaded ${commandFiles.length} commands`);
  }

  async execute(commandName, message, args) {
    const command = this.commands.get(commandName);

    if (!command) {
      return; // Silently ignore unknown commands
    }

    await command.execute(this.client, message, args, this.voiceState);
  }

  getCommands() {
    // Return unique commands (no aliases)
    const uniqueCommands = new Map();
    for (const [name, command] of this.commands) {
      if (command.name === name) {
        uniqueCommands.set(name, command);
      }
    }
    return uniqueCommands;
  }
}

module.exports = CommandHandler;
