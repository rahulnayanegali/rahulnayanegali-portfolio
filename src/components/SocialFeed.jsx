import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

// Styled components with subtle design
const SocialSection = styled.section`
  @apply bg-white rounded-lg shadow-sm mx-auto my-8 max-w-7xl;
  border: 1px solid #f0f0f0;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SectionHeader = styled.div`
  @apply bg-white border-b border-gray-100;
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(5px);
`;

const SectionTitle = styled.h2`
  @apply text-2xl font-medium text-gray-800;
  letter-spacing: -0.5px;
`;

const TweetGrid = styled.div`
  @apply p-6;
  display: grid;
  grid-auto-rows: 0;
  grid-gap: 1rem;
  overflow-y: auto;
  flex: 1;

  .tweet-container {
    break-inside: avoid;
    margin-bottom: 1rem;
  }

  /* Masonry layout using grid */
  .masonry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-flow: dense;
    grid-gap: 1rem;
  }
`;

const TweetSkeleton = styled(motion.div)`
  @apply bg-white rounded-lg border border-gray-200 p-4;
  min-height: 200px;
`;

const SkeletonHeader = styled.div`
  @apply flex items-center mb-4;
`;

const SkeletonAvatar = styled.div`
  @apply w-12 h-12 rounded-full bg-gray-200 mr-3;
`;

const SkeletonInfo = styled.div`
  @apply flex-1;
`;

const SkeletonLine = styled.div`
  @apply h-4 bg-gray-200 rounded;
  ${props => props.width && `width: ${props.width};`}
  ${props => props.mt && `margin-top: ${props.mt};`}
`;

const TweetContainer = styled.div`
  @apply bg-white rounded-lg overflow-hidden;
  .twitter-tweet {
    margin: 0 !important;
  }
`;

const ErrorBanner = styled.div`
  @apply bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 text-sm text-yellow-800;
`;

const RetryButton = styled.button`
  @apply ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors;
`;

const SkeletonTweet = () => (
  <TweetSkeleton
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
  >
    <SkeletonHeader>
      <SkeletonAvatar />
      <SkeletonInfo>
        <SkeletonLine width="140px" />
        <SkeletonLine width="100px" mt="0.5rem" />
      </SkeletonInfo>
    </SkeletonHeader>
    <SkeletonLine width="100%" />
    <SkeletonLine width="90%" mt="0.75rem" />
    <SkeletonLine width="95%" mt="0.75rem" />
    <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
      <SkeletonLine width="80px" />
      <SkeletonLine width="60px" />
    </div>
  </TweetSkeleton>
);

const SocialFeed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitReset, setRateLimitReset] = useState(null);
  const gridRef = useRef(null);
  
  const TWITTER_USERNAME = 'rahulnayanegali';

  useEffect(() => {
    fetchTweets();
  }, []);

  // Load Twitter widgets after tweets are loaded
  useEffect(() => {
    if (tweets.length > 0 && window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [tweets]);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsRateLimited(false);
      
      const response = await axios.get(`/.netlify/functions/twitter/${TWITTER_USERNAME}`);
      
      if (response.data && Array.isArray(response.data)) {
        setTweets(response.data);
        setLastUpdated(new Date());
      } else {
        setError('No tweets available');
      }
    } catch (err) {
      console.error('Error fetching tweets:', err);
      
      // Check if it's a rate limit error
      if (err.response && err.response.status === 429) {
        setIsRateLimited(true);
        
        // Get reset time from headers if available
        const resetTime = err.response.headers['x-rate-limit-reset'];
        if (resetTime) {
          const resetDate = new Date(parseInt(resetTime) * 1000);
          setRateLimitReset(resetDate);
        }
        
        // If we have cached tweets, still show them
        if (tweets.length === 0) {
          setError('Twitter API rate limit exceeded. Showing placeholder content.');
        }
      } else {
        setError('Unable to load tweets');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchTweets();
  };

  const formatResetTime = (resetTime) => {
    if (!resetTime) return 'soon';
    
    const now = new Date();
    const diffMinutes = Math.round((resetTime - now) / (60 * 1000));
    
    if (diffMinutes <= 0) return 'very soon';
    if (diffMinutes === 1) return 'in 1 minute';
    if (diffMinutes < 60) return `in ${diffMinutes} minutes`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    return `in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  };

  const renderSkeletons = () => {
    return Array(5).fill(null).map((_, index) => (
      <SkeletonTweet key={`skeleton-${index}`} />
    ));
  };

  // Function to reshuffle tweets for optimal placement
  const resizeAllGridItems = useCallback(() => {
    const allItems = document.getElementsByClassName('tweet-container');
    for (let i = 0; i < allItems.length; i++) {
      resizeGridItem(allItems[i]);
    }
  }, []);

  const resizeGridItem = (item) => {
    const grid = gridRef.current;
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const contentHeight = item.querySelector('.twitter-tweet').getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  };

  useEffect(() => {
    if (!loading && tweets.length > 0) {
      const timer = setInterval(() => {
        resizeAllGridItems();
      }, 1000); // Check every second for any height changes

      window.addEventListener('resize', resizeAllGridItems);

      return () => {
        clearInterval(timer);
        window.removeEventListener('resize', resizeAllGridItems);
      };
    }
  }, [loading, tweets, resizeAllGridItems]);

  return (
    <SocialSection>
      <SectionHeader>
        <h1 className="font-bold text-3xl tracking-tight mb-4 px-6 py-4">Recent Thoughts</h1>
        {lastUpdated && !isRateLimited && (
          <div className="text-sm text-gray-400 px-6 pb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </SectionHeader>
      
      {isRateLimited && (
        <ErrorBanner className="mx-6 mt-4">
          <p>
            Twitter API rate limit exceeded. Limits will reset {formatResetTime(rateLimitReset)}.
            {tweets.length > 0 ? ' Showing cached tweets.' : ' Showing placeholders.'}
            <RetryButton onClick={handleRetry}>Retry</RetryButton>
          </p>
        </ErrorBanner>
      )}
      
      <TweetGrid ref={gridRef}>
        {loading ? (
          renderSkeletons()
        ) : error ? (
          <div className="col-span-full p-6 text-center text-gray-500">
            {error}
          </div>
        ) : tweets.length > 0 ? (
          <div className="masonry-grid">
            {tweets.map(tweet => (
              <TweetContainer key={tweet.id} className="tweet-container">
                <blockquote 
                  className="twitter-tweet" 
                  data-theme="light"
                  data-cards="hidden"
                  data-media="hidden"
                  data-conversation="none"
                  data-width="100%"
                  data-dnt="true"
                >
                  <a 
                    href={`https://twitter.com/${TWITTER_USERNAME}/status/${tweet.id}`}
                  ></a>
                </blockquote>
              </TweetContainer>
            ))}
          </div>
        ) : (
          <div className="col-span-full p-6 text-center text-gray-500">
            No tweets found
          </div>
        )}
      </TweetGrid>
    </SocialSection>
  );
};

export default SocialFeed;
