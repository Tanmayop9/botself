/**
 * YouTube Utilities - Stream YouTube content using play-dl (Node.js)
 */

const play = require('play-dl');

/**
 * Check if URL is a YouTube URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
const isYouTubeURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    // Check for exact YouTube domains
    return hostname === 'youtube.com' || 
           hostname === 'www.youtube.com' || 
           hostname === 'm.youtube.com' ||
           hostname === 'youtu.be' ||
           hostname === 'www.youtu.be';
  } catch (e) {
    return false;
  }
};

/**
 * Get video info from YouTube
 * @param {string} url - YouTube URL
 * @returns {Promise<{title: string, duration: number, id: string}>}
 */
const getVideoInfo = async (url) => {
  try {
    const info = await play.video_info(url);
    return {
      title: info.video_details.title,
      duration: info.video_details.durationInSec,
      id: info.video_details.id,
    };
  } catch (error) {
    throw new Error(`Failed to get video info: ${error.message}`);
  }
};

/**
 * Get audio stream from YouTube
 * @param {string} url - YouTube URL
 * @returns {Promise<{stream: ReadableStream, title: string, type: string}>}
 */
const getAudioStream = async (url) => {
  try {
    const info = await play.video_info(url);
    const title = info.video_details.title;
    
    // Get audio stream
    const stream = await play.stream(url, { quality: 2 }); // quality 2 = highest audio
    
    return {
      stream: stream.stream,
      title,
      type: stream.type,
    };
  } catch (error) {
    throw new Error(`Failed to get audio stream: ${error.message}`);
  }
};

/**
 * Get video stream from YouTube (for streaming)
 * @param {string} url - YouTube URL
 * @returns {Promise<{stream: ReadableStream, title: string, type: string}>}
 */
const getVideoStream = async (url) => {
  try {
    const info = await play.video_info(url);
    const title = info.video_details.title;
    
    // Get video stream with audio
    const stream = await play.stream(url, { quality: 1 }); // quality 1 = best video
    
    return {
      stream: stream.stream,
      title,
      type: stream.type,
    };
  } catch (error) {
    throw new Error(`Failed to get video stream: ${error.message}`);
  }
};

/**
 * Validate YouTube URL and get basic info
 * @param {string} url - URL to validate
 * @returns {Promise<boolean>}
 */
const validateYouTubeURL = async (url) => {
  try {
    if (!isYouTubeURL(url)) {
      return false;
    }
    const type = await play.validate(url);
    return type === 'yt_video';
  } catch (e) {
    return false;
  }
};

module.exports = {
  isYouTubeURL,
  getVideoInfo,
  getAudioStream,
  getVideoStream,
  validateYouTubeURL,
};
