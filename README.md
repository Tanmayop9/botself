# 🎵 Discord VC Selfbot

A feature-rich Discord selfbot for voice channels with audio/video playback, recording, and streaming capabilities. Built with [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13).

## ✨ Features

### Voice Channel
- 🔊 Join and leave voice channels
- 🔇 Toggle self-mute and self-deaf
- 📊 View voice connection info

### Audio Playback
- ▶️ Play audio from YouTube URLs
- ⏸️ Pause and resume playback
- ⏹️ Stop playback
- 🔊 Volume control (0-200%)
- 📋 Queue management (add, skip, clear)
- 🔁 Loop mode

### Video Streaming
- 📺 Stream video with screen share
- 🎬 Support for video URLs and files

### Recording
- 🎙️ Record audio from users
- 📹 Record video streams
- 💾 Save recordings as PCM/MKV files

### Utility
- 🎮 Custom activity status
- 🏓 Ping/latency check
- ℹ️ Voice connection info

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
| `ACTIVITY_TEXT` | Custom activity text | - |
| `ACTIVITY_TYPE` | Activity type (PLAYING, WATCHING, etc.) | `PLAYING` |

## 📖 Commands

### Voice Channel
| Command | Description |
|---------|-------------|
| `!join [channel_id]` | Join a voice channel |
| `!leave` | Leave the current voice channel |
| `!deaf` | Toggle self-deaf |
| `!mute` | Toggle self-mute |

### Audio Playback
| Command | Description |
|---------|-------------|
| `!play <url>` | Play audio from YouTube or URL |
| `!pause` | Pause current playback |
| `!resume` | Resume paused playback |
| `!stop` | Stop playback and clear queue |
| `!skip` | Skip to next track |
| `!volume <0-200>` | Set playback volume |
| `!loop` | Toggle loop mode |

### Queue Management
| Command | Description |
|---------|-------------|
| `!queue` | View the current queue |
| `!add <url>` | Add a track to queue |
| `!clear` | Clear the queue |
| `!nowplaying` | Show current track info |

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
| `!status [type] <text>` | Set custom status |
| `!ping` | Check bot latency |
| `!info` | Show voice connection info |
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