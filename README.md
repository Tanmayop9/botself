# 🎵 Discord VC Selfbot

A feature-rich, advanced Discord selfbot for voice channels with audio/video playback, recording, streaming, playlists, and audio effects. Built with [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13).

## ✨ Features

### Voice Channel
- 🔊 Join and leave voice channels
- 🔇 Toggle self-mute and self-deaf
- 🔄 24/7 mode with auto-rejoin
- 📊 View detailed voice connection info

### Audio Playback
- ▶️ Play audio from YouTube URLs
- ⏸️ Pause and resume playback
- ⏹️ Stop playback
- ⏭️ Skip / Previous track navigation
- 🔊 Volume control (0-200%)
- 🔁 Track and queue loop modes
- 📜 Play history with previous track support

### Queue Management
- 📋 Add, remove, and view queue
- 🔀 Shuffle queue
- 📍 Move tracks to different positions
- 💾 Save and load playlists

### Audio Effects
- 🔊 Bass Boost
- 🌙 Nightcore
- ⏩ Playback speed control (0.5x - 2.0x)

### Video Streaming
- 📺 Stream video with screen share
- 🎬 Support for video URLs and files

### Recording
- 🎙️ Record audio from users
- 📹 Record video streams
- 💾 Save recordings as PCM/MKV files

### Utility
- 🏓 Ping/latency check
- 📊 Bot statistics
- ℹ️ Detailed voice connection info
- 👥 Authorized users support

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- FFmpeg installed and added to system PATH
- npm or yarn

### Installing FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tanmayop9/botself.git
   cd botself
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Discord token:
   ```env
   DISCORD_TOKEN=your_discord_token_here
   PREFIX=!
   AUTHORIZED_USERS=user_id_1,user_id_2
   ```

4. **Start the bot:**
   ```bash
   npm start
   ```

## ⚙️ Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Your Discord account token (required) | - |
| `PREFIX` | Command prefix | `!` |
| `AUTHORIZED_USERS` | Comma-separated user IDs who can control the bot | - |

## 📖 Commands

### Voice Channel
| Command | Description |
|---------|-------------|
| `!join [channel_id]` | Join a voice channel |
| `!leave` | Leave the current voice channel |
| `!deaf` | Toggle self-deaf |
| `!mute` | Toggle self-mute |
| `!247` | Toggle 24/7 mode (auto-rejoin) |
| `!afk [channel_id\|off]` | Set AFK auto-rejoin channel |

### Audio Playback
| Command | Description |
|---------|-------------|
| `!play <url>` | Play audio from YouTube or URL |
| `!pause` | Pause current playback |
| `!resume` | Resume paused playback |
| `!stop` | Stop playback and clear queue |
| `!skip` | Skip to next track |
| `!previous` | Play previous track from history |
| `!replay` | Replay current track |
| `!seek <time>` | Seek to position (e.g., 1:30) |
| `!volume <0-200>` | Set playback volume |
| `!loop` | Toggle track loop mode |
| `!loopqueue` | Toggle queue loop mode |

### Queue Management
| Command | Description |
|---------|-------------|
| `!queue` | View the current queue |
| `!add <url>` | Add a track to queue |
| `!remove <position>` | Remove track from queue |
| `!move <from> <to>` | Move track position |
| `!shuffle` | Shuffle the queue |
| `!clear` | Clear the queue |
| `!nowplaying` | Show current track info |
| `!grab` | Get current track URL |

### Playlists
| Command | Description |
|---------|-------------|
| `!savequeue <name>` | Save queue as playlist |
| `!loadqueue <name>` | Load a saved playlist |
| `!playlists` | List all saved playlists |
| `!deleteplaylist <name>` | Delete a playlist |

### Audio Effects
| Command | Description |
|---------|-------------|
| `!filters [type]` | Toggle audio filters (bassboost, nightcore) |
| `!speed <0.5-2.0>` | Set playback speed |
| `!bitrate` | Show channel bitrate |

### Video/Streaming
| Command | Description |
|---------|-------------|
| `!stream <url>` | Stream video with screen share |
| `!stopstream` | Stop video streaming |

### Recording
| Command | Description |
|---------|-------------|
| `!record <user_id>` | Record user's audio |
| `!stoprecord` | Stop audio recording |
| `!recordvideo <user_id>` | Record user's video |
| `!stoprecordvideo` | Stop video recording |

### Utility
| Command | Description |
|---------|-------------|
| `!ping` | Check bot latency |
| `!info` | Show voice connection info |
| `!stats` | Show bot statistics |
| `!help [command]` | Show help message |

## 🔐 Getting Your Discord Token

1. Open Discord in your browser (not the app)
2. Press `F12` to open Developer Tools
3. Go to the `Network` tab
4. Type something in any chat
5. Look for a request to `messages`
6. Click on it and find `Authorization` in the headers
7. That's your token!

> ⚠️ **Warning:** Never share your Discord token with anyone!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) - The selfbot library
- [@distube/ytdl-core](https://github.com/distubejs/ytdl-core) - YouTube downloader
- [discord-video-stream](https://github.com/dank074/Discord-video-stream) - Video streaming implementation

## ⚠️ Disclaimer

Self-bots are against Discord's Terms of Service. Use this at your own risk. The authors are not responsible for any consequences of using this software.

---

Made with ❤️ for the Discord community