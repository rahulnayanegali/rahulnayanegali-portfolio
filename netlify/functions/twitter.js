import { Client } from 'twitter-api-sdk';
import NodeCache from 'node-cache';

// Constants
const CACHE_TTL = 3600 * 4; // 4 hours
const MAX_TWEETS = 10;

// Cache setup
const cache = new NodeCache({ 
  stdTTL: CACHE_TTL,
  checkperiod: 600
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const sendResponse = (statusCode, body, additionalHeaders = {}) => ({
  statusCode,
  headers: { ...corsHeaders, ...additionalHeaders },
  body: JSON.stringify(body)
});

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return sendResponse(200, '');
  }

  try {
    const username = event.path.split('/').pop();
    const cacheKey = `twitter_${username}`;

    // Return cached tweets if available
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return sendResponse(200, cachedData.tweets);
    }

    // Validate Twitter configuration
    if (!process.env.TWITTER_BEARER_TOKEN) {
      return sendResponse(400, { error: 'Twitter API configuration missing' });
    }

    const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN);

    // Get user data
    const userResponse = await twitterClient.users.findUserByUsername(username);
    if (!userResponse.data) {
      return sendResponse(404, { error: 'Twitter user not found' });
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
      return sendResponse(404, { error: 'No tweets found' });
    }

    // Cache and return tweets
    const tweets = tweetsResponse.data.slice(0, MAX_TWEETS);
    cache.set(cacheKey, { 
      tweets,
      timestamp: Date.now()
    });
    
    return sendResponse(200, tweets);

  } catch (error) {
    console.error('Twitter API Error:', error);

    if (error.status === 429) {
      const resetTime = error.headers?.['x-rate-limit-reset'];
      return sendResponse(429, {
        error: 'Rate limit exceeded',
        resetTime: resetTime ? parseInt(resetTime) * 1000 : null
      });
    }

    return sendResponse(500, {
      error: `Failed to fetch tweets ${error.message}`,
      message: error
    });
  }
};
