import 'dotenv/config';
import express from 'express';
import { Client } from 'twitter-api-sdk';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

// Trust proxy - required for express-rate-limit when behind a reverse proxy
app.set('trust proxy', 1);

// Dummy tweets for fallback
const DUMMY_TWEETS = [
  {
    id: '1234567890123456789',
    text: "🚀 Just launched my updated portfolio website using React and TailwindCSS! Check out my latest projects and let me know what you think. #WebDev #React #Portfolio",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    text: "💡 Deep diving into modern web architecture patterns. Currently exploring micro-frontends and module federation. Exciting times in frontend development! #JavaScript #Architecture #WebDev",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    text: "🎨 Been experimenting with Framer Motion for smooth animations in React. The possibilities are endless! Check out my latest project showcase. #React #UI #Animation",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  }
];

// Cache setup - keep data for longer to avoid hitting Twitter rate limits
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour cache
  checkperiod: 120 // Check for expired keys every 2 minutes
});

// Rate limiting setup - make it less restrictive
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // limit each IP to 30 requests per hour
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

// Apply rate limiting to all requests
app.use(limiter);

// Twitter API setup
const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN);

app.get('/api/twitter/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const cacheKey = `twitter_${username}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data');
      return res.json(cachedData);
    }

    // If no cached data exists, try to fetch from Twitter API
    console.log('Fetching data from Twitter API');
    try {
      const userResponse = await twitterClient.users.findUserByUsername(username);
      if (!userResponse.data) {
        throw new Error('User not found');
      }
      
      const userId = userResponse.data.id;
      const tweetsResponse = await twitterClient.tweets.usersIdTweets(userId, {
        max_results: 10,
        'tweet.fields': ['created_at', 'text']
      });
      
      
      if (tweetsResponse.data && tweetsResponse.data.length > 0) {
        cache.set(cacheKey, tweetsResponse.data);
        return res.json(tweetsResponse.data);
      } else {
        throw new Error('No tweets found');
      }
    } catch (twitterError) {
      console.error('Twitter API Error:', twitterError);
      // If Twitter API fails, return dummy data
      cache.set(cacheKey, DUMMY_TWEETS);
      return res.json(DUMMY_TWEETS);
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
