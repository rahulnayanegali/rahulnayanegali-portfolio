import { Client } from 'twitter-api-sdk';
import NodeCache from 'node-cache';

// Cache setup with longer TTL
const cache = new NodeCache({ 
  stdTTL: 3600 * 2, // 2 hours cache
  checkperiod: 120 
});

// Store rate limit info globally
let rateLimitInfo = {
  limit: null,
  remaining: null,
  reset: null
};

// Dummy tweets for rate limit fallback
const DUMMY_TWEETS = [
  {
    id: '1234567890123456789',
    text: "🚀 Just launched my updated portfolio website using React and TailwindCSS! Check out my latest projects and let me know what you think. #WebDev #React #Portfolio",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '1234567890123456790',
    text: "💡 Deep diving into modern web architecture patterns. Currently exploring micro-frontends and module federation. Exciting times in frontend development! #JavaScript #Architecture",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '1234567890123456791',
    text: "🎨 Been experimenting with Framer Motion for smooth animations in React. The possibilities are endless! #React #UI #Animation",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Add this function to update rate limit info
const updateRateLimitInfo = (headers) => {
  if (headers['x-rate-limit-limit']) {
    rateLimitInfo = {
      limit: parseInt(headers['x-rate-limit-limit']),
      remaining: parseInt(headers['x-rate-limit-remaining']),
      reset: parseInt(headers['x-rate-limit-reset']) * 1000 // Convert to milliseconds
    };
  }
};

const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN);

export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const username = event.path.split('/').pop();
    const cacheKey = `twitter_${username}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cachedData)
      };
    }

    // If no cache, try Twitter API
    try {
      console.log('Fetching from Twitter API');
      const userResponse = await twitterClient.users.findUserByUsername(username);
      
      if (!userResponse.data) {
        console.log('User not found, returning dummy data');
        cache.set(cacheKey, DUMMY_TWEETS);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(DUMMY_TWEETS)
        };
      }
      
      const userId = userResponse.data.id;
      const tweetsResponse = await twitterClient.tweets.usersIdTweets(userId, {
        max_results: 5,
        exclude: ['retweets', 'replies'],
        'tweet.fields': ['created_at', 'text', 'author_id']
      });
      console.log('tweetsResponse', tweetsResponse)
      if (tweetsResponse.data && tweetsResponse.data.length > 0) {
        updateRateLimitInfo(tweetsResponse.headers || {});
        const tweets = tweetsResponse.data.slice(0, 5);
        cache.set(cacheKey, tweets);
        return {
          statusCode: 200,
          headers: {
            ...headers,
            'X-RateLimit-Remaining': rateLimitInfo.remaining || '',
            'X-RateLimit-Reset': rateLimitInfo.reset || ''
          },
          body: JSON.stringify(tweets)
        };
      }
      
      // No tweets found, use dummy data
      cache.set(cacheKey, DUMMY_TWEETS);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(DUMMY_TWEETS)
      };

    } catch (twitterError) {
      console.log('twitterError', twitterError)
      console.log('Twitter API Error:', twitterError.status);
      
      // If rate limited, return dummy data with rate limit info
      // In the rate limit handling section (line ~106)
if (twitterError.status === 429) {
  const resetTime = twitterError.headers?.['x-rate-limit-reset'];
  const resetTimeMs = resetTime ? parseInt(resetTime) * 1000 : null; // Convert to milliseconds
  cache.set(cacheKey, DUMMY_TWEETS); // Cache dummy data temporarily
  return {
    statusCode: 200,
    headers: {
      ...headers,
      'X-RateLimit-Reset': resetTimeMs || '',
      'X-RateLimit-Limited': 'true'
    },
    body: JSON.stringify(DUMMY_TWEETS)
  };
}


      // For other errors, return dummy data
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(DUMMY_TWEETS)
      };
    }
  } catch (error) {
    console.error('Server Error:', error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(DUMMY_TWEETS)
    };
  }
};
