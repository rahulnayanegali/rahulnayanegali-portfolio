import 'dotenv/config';
import express from 'express';
import { Client } from 'twitter-api-sdk';
import rateLimit from 'express-rate-limit';
import NodeCache from 'node-cache';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());

// Trust proxy - required for rate limiting
app.set('trust proxy', 1);

// Dummy tweets for fallback with real tweet IDs
const DUMMY_TWEETS = [
  {
    id: '1769613681544552740',  // Replace with one of your actual tweet IDs
    text: "🚀 Just launched my updated portfolio website using React and TailwindCSS! Check out my latest projects and let me know what you think. #WebDev #React #Portfolio",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '1769613681544552741',  // Replace with another real tweet ID
    text: "💡 Deep diving into modern web architecture patterns. Currently exploring micro-frontends and module federation. Exciting times in frontend development! #JavaScript #Architecture #WebDev",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    text: "🎨 Been experimenting with Framer Motion for smooth animations in React. The possibilities are endless! Check out my latest project showcase. #React #UI #Animation",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    text: "📚 Just completed an advanced course on TypeScript and Next.js. Time to apply these skills to upcoming projects! #TypeScript #NextJS #Learning",
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    text: "🔧 Working on optimizing performance in my React applications. Reduced bundle size by 40% using code splitting and lazy loading! #Performance #React #Optimization",
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  }
];

// Cache setup
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour cache
  checkperiod: 120 // Check for expired keys every 2 minutes
});

// Rate limiting setup
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

// Simulate API delay
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 2000));

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
        'tweet.fields': ['created_at', 'text', 'author_id', 'entities', 'public_metrics']
      });
      
      if (tweetsResponse.data && tweetsResponse.data.length > 0) {
        cache.set(cacheKey, tweetsResponse.data);
        return res.json(tweetsResponse.data);
      } else {
        throw new Error('No tweets found');
      }
    } catch (twitterError) {
      console.error('Twitter API Error:', twitterError);
      
      // Check if it's a rate limit error (code 88 or status 429)
      if (twitterError.status === 429 || 
          (twitterError.errors && twitterError.errors[0] && twitterError.errors[0].code === 88)) {
        
        // Get the reset time if available
        const resetTime = twitterError.rateLimit?.reset;
        
        // If we have cached data, return it with rate limit headers
        if (cachedData) {
          res.set('X-Rate-Limit-Reset', resetTime || Math.floor(Date.now()/1000) + 900); // Default to 15 mins
          return res.json(cachedData);
        }
        
        // Otherwise return a 429 with reset time
        return res.status(429).json({
          error: 'Rate limit exceeded',
          resetTime: resetTime || Math.floor(Date.now()/1000) + 900, // Default to 15 mins
          message: 'Twitter API rate limit exceeded. Please try again later.'
        });
      }
      
      // For other errors, return dummy data
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