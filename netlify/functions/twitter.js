import 'dotenv/config';
import express from 'express';
import { Client } from 'twitter-api-sdk';
import serverless from 'serverless-http';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ 
  stdTTL: 3600, // 1 hour cache
  checkperiod: 120 // Check for expired keys every 2 minutes
});

// Dummy tweets for fallback
const DUMMY_TWEETS = [
  {
    id: '1234567890123456789',
    text: "🚀 Just launched my updated portfolio website using React and TailwindCSS! Check out my latest projects and let me know what you think. #WebDev #React #Portfolio",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  // Other dummy tweets...
];

// Twitter API setup
const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN);

app.get('/twitter/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const cacheKey = `twitter_${username}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning cached data');
      return res.json(cachedData);
    }

    console.log('Fetching data from Twitter API');
    try {
      const userResponse = await twitterClient.users.findUserByUsername(username);
      if (!userResponse.data) {
        throw new Error('User not found');
      }
      
      const userId = userResponse.data.id;
      const tweetsResponse = await twitterClient.tweets.usersIdTweets(userId, {
        max_results: 5,
        exclude: ['retweets', 'replies'],
        'tweet.fields': ['created_at', 'text', 'author_id']
      });
      
      if (tweetsResponse.data && tweetsResponse.data.length > 0) {
        const originalTweets = tweetsResponse.data
          .filter(tweet => !tweet.referenced_tweets)
          .slice(0, 5);

        cache.set(cacheKey, originalTweets);
        return res.json(originalTweets);
      } else {
        throw new Error('No tweets found');
      }
    } catch (twitterError) {
      console.error('Twitter API Error:', twitterError);
      const limitedDummyTweets = DUMMY_TWEETS.slice(0, 5);
      cache.set(cacheKey, limitedDummyTweets);
      return res.json(limitedDummyTweets);
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

// This is the key part for Netlify Functions
export const handler = serverless(app);
