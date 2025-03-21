import { Client } from 'twitter-api-sdk';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';

// Constants
const CACHE_TTL = 3600 * 6; // 6 hours - fresh data
const STALE_TTL = 3600 * 24; // 24 hours - stale data
const MAX_TWEETS = 10;

// File-based cache configuration
const TMP_DIR = '/tmp'; // Lambda/Netlify Functions tmp directory
const CACHE_FILE = path.join(TMP_DIR, 'twitter_cache.json');

// Memory cache setup
const memoryCache = new NodeCache({ 
  stdTTL: CACHE_TTL,
  checkperiod: 600
});

// File-based cache helpers
const readFileCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading cache file:', error);
  }
  return {};
};

const writeFileCache = (cacheData) => {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData), 'utf8');
  } catch (error) {
    console.error('Error writing cache file:', error);
  }
};

// Combined cache helpers
const getCachedData = (key) => {
  // Try memory cache first (fastest)
  const memData = memoryCache.get(key);
  if (memData) {
    return { ...memData, source: 'memory' };
  }
  
  // Then try file cache
  try {
    const fileCache = readFileCache();
    const fileData = fileCache[key];
    
    if (fileData && fileData.timestamp) {
      // Check if data is still valid based on TTL
      const now = Date.now();
      const age = now - fileData.timestamp;
      
      // Check if it's still fresh
      if (age < CACHE_TTL * 1000) {
        // Restore to memory cache and return
        memoryCache.set(key, fileData);
        return { ...fileData, source: 'file-fresh' };
      }
      
      // Check if it can be used as stale data
      if (age < STALE_TTL * 1000) {
        return { ...fileData, source: 'file-stale' };
      }
    }
  } catch (error) {
    console.error('Error accessing file cache:', error);
  }
  
  return null;
};

const setCachedData = (key, data) => {
  // Set in memory cache
  const cacheData = {
    ...data,
    timestamp: Date.now()
  };
  
  memoryCache.set(key, cacheData);
  
  // Also update file cache
  try {
    const fileCache = readFileCache();
    fileCache[key] = cacheData;
    writeFileCache(fileCache);
  } catch (error) {
    console.error('Error updating file cache:', error);
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const sendResponse = (statusCode, body, additionalHeaders = {}, cacheControl = null) => {
  const headers = { ...corsHeaders, ...additionalHeaders };
  
  // Add cache control headers if provided
  if (cacheControl) {
    headers['Cache-Control'] = cacheControl;
  }
  
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return sendResponse(200, '');
  }

  try {
    const username = event.path.split('/').pop();
    const cacheKey = `twitter_${username}`;

    // Look for cached data (fresh or stale)
    const cachedData = getCachedData(cacheKey);
    
    // Background refresh function (used for stale-while-revalidate)
    const refreshDataInBackground = async () => {
      try {
        await fetchTwitterData(username, cacheKey);
        console.log(`Background refresh completed for ${username}`);
      } catch (error) {
        console.error(`Background refresh failed for ${username}:`, error);
      }
    };

    // Handle cached data scenarios
    if (cachedData) {
      const age = Math.floor((Date.now() - cachedData.timestamp) / 1000);
      const maxAge = CACHE_TTL - age;
      
      // If we have fresh cached data
      if (cachedData.source === 'memory' || cachedData.source === 'file-fresh') {
        return sendResponse(
          200, 
          cachedData.tweets, 
          { 
            'X-Cache': cachedData.source,
            'X-Cache-Age': `${age}s` 
          },
          `public, max-age=${maxAge}, stale-while-revalidate=${STALE_TTL - CACHE_TTL}`
        );
      }
      
      // If we have stale data, use it but refresh in background
      if (cachedData.source === 'file-stale') {
        // Start background refresh without waiting
        refreshDataInBackground();
        
        return sendResponse(
          200, 
          cachedData.tweets, 
          { 
            'X-Cache': 'stale',
            'X-Cache-Age': `${age}s` 
          },
          'public, max-age=0, stale-while-revalidate=3600'
        );
      }
    }

    // No cache hit, fetch fresh data
    const tweetData = await fetchTwitterData(username, cacheKey);
    
    return sendResponse(
      200, 
      tweetData.tweets, 
      { 'X-Cache': 'MISS' },
      `public, max-age=${CACHE_TTL}, stale-while-revalidate=${STALE_TTL - CACHE_TTL}`
    );

  } catch (error) {
    console.error('Twitter API Error:', error);

    // Log error details but don't expose token
    console.log(`Error details: ${JSON.stringify({
      status: error.status,
      message: error.message,
      name: error.name
    })}`);

    if (error.status === 429) {
      const resetTime = error.headers?.['x-rate-limit-reset'];
      return sendResponse(429, {
        error: 'Rate limit exceeded',
        resetTime: resetTime ? parseInt(resetTime) * 1000 : null
      }, {}, 'no-store');
    }

    return sendResponse(500, {
      error: 'Failed to fetch tweets',
      message: error.message || 'Unknown error'
    }, {}, 'no-store');
  }
};

// Function to fetch Twitter data
async function fetchTwitterData(username, cacheKey) {
  // Validate Twitter configuration
  if (!process.env.TWITTER_BEARER_TOKEN) {
    throw new Error('Twitter API configuration missing');
  }

  const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN);

  // Get user data
  const userResponse = await twitterClient.users.findUserByUsername(username);
  if (!userResponse.data) {
    throw new Error('Twitter user not found');
  }

  // Fetch tweets
  const tweetsResponse = await twitterClient.tweets.usersIdTweets(
    userResponse.data.id,
    {
      max_results: MAX_TWEETS,
      exclude: ['retweets', 'replies'],
      'tweet.fields': ['created_at', 'text', 'author_id']
    }
  );

  if (!tweetsResponse.data?.length) {
    throw new Error('No tweets found');
  }

  // Prepare tweet data
  const tweetData = { 
    tweets: tweetsResponse.data.slice(0, MAX_TWEETS),
    timestamp: Date.now()
  };
  
  // Cache the data
  setCachedData(cacheKey, tweetData);
  
  return tweetData;
}
