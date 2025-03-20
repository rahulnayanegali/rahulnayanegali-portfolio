import { Client } from 'twitter-api-sdk';

// Twitter API setup
const twitterClient = new Client(process.env.TWITTER_BEARER_TOKEN);

// Dummy tweets for fallback
const DUMMY_TWEETS = [
  {
    id: '1234567890123456789',
    text: "🚀 Just launched my updated portfolio website using React and TailwindCSS! Check out my latest projects and let me know what you think. #WebDev #React #Portfolio",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  // Other dummy tweets...
];

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Token available:', !!process.env.TWITTER_BEARER_TOKEN);
    
    // Extract username from path
    const username = event.path.split('/').pop();
    
    if (!username) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Username is required' })
      };
    }

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

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(originalTweets)
        };
      }
    } catch (twitterError) {
      console.error('Twitter API Error:', twitterError);
      // Return dummy tweets as fallback
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(DUMMY_TWEETS.slice(0, 5))
      };
    }
  } catch (error) {
    console.error('Server Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Server error', 
        message: error.message 
      })
    };
  }
};
