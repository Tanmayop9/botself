/**
 * YouTube Utilities - Download and manage YouTube content using yt-dlp
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Downloads directory
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

// Ensure downloads directory exists
const ensureDownloadsDir = () => {
  if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
  }
};

/**
 * Check if URL is a YouTube URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
const isYouTubeURL = (url) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Get video info using yt-dlp
 * @param {string} url - YouTube URL
 * @returns {Promise<{title: string, duration: number, id: string}>}
 */
const getVideoInfo = (url) => {
  return new Promise((resolve, reject) => {
    const args = [
      '--dump-json',
      '--no-download',
      url,
    ];

    const process = spawn('yt-dlp', args);
    let output = '';
    let error = '';

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          resolve({
            title: info.title,
            duration: info.duration,
            id: info.id,
          });
        } catch (e) {
          reject(new Error('Failed to parse video info'));
        }
      } else {
        reject(new Error(error || 'Failed to get video info'));
      }
    });

    process.on('error', (err) => {
      reject(new Error(`yt-dlp not found: ${err.message}`));
    });
  });
};

/**
 * Download audio from YouTube
 * @param {string} url - YouTube URL
 * @param {function} onProgress - Progress callback
 * @returns {Promise<{filePath: string, title: string}>}
 */
const downloadAudio = (url, onProgress = null) => {
  return new Promise((resolve, reject) => {
    ensureDownloadsDir();
    
    const timestamp = Date.now();
    const outputTemplate = path.join(DOWNLOADS_DIR, `audio_${timestamp}.%(ext)s`);
    
    const args = [
      '-f', 'bestaudio[ext=m4a]/bestaudio/best',
      '-x',
      '--audio-format', 'mp3',
      '--audio-quality', '0',
      '-o', outputTemplate,
      '--no-playlist',
      '--print', 'after_move:filepath',
      '--print', 'title',
      url,
    ];

    const process = spawn('yt-dlp', args);
    let output = '';
    let error = '';
    let title = '';

    process.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      
      // Parse progress if callback provided
      if (onProgress) {
        const progressMatch = text.match(/(\d+\.?\d*)%/);
        if (progressMatch) {
          onProgress(parseFloat(progressMatch[1]));
        }
      }
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        const lines = output.trim().split('\n');
        // Last two lines are filepath and title
        const filePath = lines[lines.length - 2] || '';
        title = lines[lines.length - 1] || 'Unknown';
        
        if (filePath && fs.existsSync(filePath)) {
          resolve({ filePath, title });
        } else {
          // Try to find the file
          const files = fs.readdirSync(DOWNLOADS_DIR)
            .filter(f => f.startsWith(`audio_${timestamp}`))
            .map(f => path.join(DOWNLOADS_DIR, f));
          
          if (files.length > 0) {
            resolve({ filePath: files[0], title });
          } else {
            reject(new Error('Downloaded file not found'));
          }
        }
      } else {
        reject(new Error(error || 'Failed to download audio'));
      }
    });

    process.on('error', (err) => {
      reject(new Error(`yt-dlp not found: ${err.message}`));
    });
  });
};

/**
 * Download video from YouTube
 * @param {string} url - YouTube URL
 * @param {function} onProgress - Progress callback
 * @returns {Promise<{filePath: string, title: string}>}
 */
const downloadVideo = (url, onProgress = null) => {
  return new Promise((resolve, reject) => {
    ensureDownloadsDir();
    
    const timestamp = Date.now();
    const outputTemplate = path.join(DOWNLOADS_DIR, `video_${timestamp}.%(ext)s`);
    
    const args = [
      '-f', 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
      '--merge-output-format', 'mp4',
      '-o', outputTemplate,
      '--no-playlist',
      '--print', 'after_move:filepath',
      '--print', 'title',
      url,
    ];

    const process = spawn('yt-dlp', args);
    let output = '';
    let error = '';
    let title = '';

    process.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      
      // Parse progress if callback provided
      if (onProgress) {
        const progressMatch = text.match(/(\d+\.?\d*)%/);
        if (progressMatch) {
          onProgress(parseFloat(progressMatch[1]));
        }
      }
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        const lines = output.trim().split('\n');
        // Last two lines are filepath and title
        const filePath = lines[lines.length - 2] || '';
        title = lines[lines.length - 1] || 'Unknown';
        
        if (filePath && fs.existsSync(filePath)) {
          resolve({ filePath, title });
        } else {
          // Try to find the file
          const files = fs.readdirSync(DOWNLOADS_DIR)
            .filter(f => f.startsWith(`video_${timestamp}`))
            .map(f => path.join(DOWNLOADS_DIR, f));
          
          if (files.length > 0) {
            resolve({ filePath: files[0], title });
          } else {
            reject(new Error('Downloaded file not found'));
          }
        }
      } else {
        reject(new Error(error || 'Failed to download video'));
      }
    });

    process.on('error', (err) => {
      reject(new Error(`yt-dlp not found: ${err.message}`));
    });
  });
};

/**
 * Delete a downloaded file
 * @param {string} filePath - Path to the file
 */
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Clean up old downloads (older than 1 hour)
 */
const cleanupOldDownloads = () => {
  try {
    ensureDownloadsDir();
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const file of files) {
      const filePath = path.join(DOWNLOADS_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < oneHourAgo) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Cleaned up old file: ${file}`);
      }
    }
  } catch (error) {
    console.error(`Cleanup error: ${error.message}`);
  }
};

module.exports = {
  isYouTubeURL,
  getVideoInfo,
  downloadAudio,
  downloadVideo,
  deleteFile,
  cleanupOldDownloads,
  DOWNLOADS_DIR,
};
