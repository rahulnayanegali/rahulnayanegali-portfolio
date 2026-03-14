import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';

// Styled components with subtle design
const SocialSection = styled.section`
  @apply bg-white rounded-lg shadow-sm mx-auto my-8 max-w-7xl;
  border: 1px solid #f0f0f0;
  height: 100vh;
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

const SkeletonTweet = () => (
  <TweetSkeleton
    initial={{ opacity: 0.6 }}
    animate={{ opacity: 1 }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
    data-testid="skeleton-tweet"
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
  const TWITTER_USERNAME = 'rahulnayanegali';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  const [state, setState] = useState({
    tweets: [],
    loading: true,
    error: null,
    lastUpdated: null,
    isRateLimited: false,
    rateLimitReset: null,
    retryAttempts: 0,
    retryDisabled: false,
    countdown: null
  });

  const gridRef = useRef(null);
  const [localCache, setLocalCache] = useState(() => {
    try {
      const cached = localStorage.getItem('twitter_cache');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache parsing error:', error);
      return null;
    }
  });

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleCache = useCallback((tweets) => {
    const cacheData = {
      tweets,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('twitter_cache', JSON.stringify(cacheData));
    setLocalCache(cacheData);
  }, []);

  const fetchTweets = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });

      // Check cache validity
      if (localCache) {
        const cacheAge = new Date() - new Date(localCache.timestamp);
        if (cacheAge < CACHE_DURATION) {
          updateState({
            tweets: localCache.tweets,
            lastUpdated: new Date(localCache.timestamp),
            loading: false
          });
          return;
        }
      }

      const response = await axios.get(`/api/twitter/${TWITTER_USERNAME}`);

      if (response.data && Array.isArray(response.data)) {
        handleCache(response.data);
        updateState({
          tweets: response.data,
          lastUpdated: new Date()
        });
      }
    } catch (err) {
      console.error('Error fetching tweets:', err);
      if (localCache) {
        updateState({
          tweets: localCache.tweets,
          lastUpdated: new Date(localCache.timestamp)
        });
      }
      updateState({ error: 'Unable to load fresh tweets. Showing cached content.' });
    } finally {
      updateState({ loading: false });
    }
  }, [localCache, handleCache]);

  // Grid management
  const resizeGridItem = useCallback((item) => {
    if (!gridRef.current || !item) return;

    const grid = gridRef.current;
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const tweetElement = item.querySelector('.twitter-tweet');

    if (!tweetElement) return;

    const contentHeight = tweetElement.getBoundingClientRect().height;
    const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  }, []);

  const resizeAllGridItems = useCallback(() => {
    const allItems = document.getElementsByClassName('tweet-container');
    Array.from(allItems).forEach(resizeGridItem);
  }, [resizeGridItem]);

  // Effects
  useEffect(() => {
    fetchTweets();
  }, [fetchTweets]);

  useEffect(() => {
    if (state.tweets.length > 0 && window.twttr?.widgets) {
      window.twttr.widgets.load();
    }
  }, [state.tweets]);

  useEffect(() => {
    if (!state.loading && state.tweets.length > 0) {
      resizeAllGridItems();
      const timer = setInterval(resizeAllGridItems, 5000);
      return () => clearInterval(timer);
    }
  }, [state.loading, state.tweets, resizeAllGridItems]);

  // Render methods
  const renderSkeletons = () => (
    Array(5).fill(null).map((_, index) => (
      <SkeletonTweet key={`skeleton-${index}`} />
    ))
  );

  const renderTweets = () => (
    <div className="masonry-grid" id='tweets'>
      {state.tweets.map(tweet => (
        <TweetContainer key={tweet.id} className="tweet-container" data-testid="tweet-container">
          <blockquote
            className="twitter-tweet"
            data-theme="light"
            data-cards="hidden"
            data-media="hidden"
            data-conversation="none"
            data-width="100%"
            data-dnt="true"
          >
            <a href={`https://twitter.com/${TWITTER_USERNAME}/status/${tweet.id}`} />
          </blockquote>
        </TweetContainer>
      ))}
    </div>
  );

  return (
    <SocialSection>
      <SectionHeader>
        <h1 className="font-bold text-3xl tracking-tight mb-4 px-6 py-4">Recent Tweets</h1>
        {state.lastUpdated && (
          <div className="text-sm text-gray-400 px-6 pb-4">
            Last updated: {state.lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </SectionHeader>

      <TweetGrid ref={gridRef}>
        {(state.loading || state.error)? renderSkeletons() :
           state.tweets.length > 0 ? renderTweets() : (
            <div className="col-span-full p-6 text-center text-gray-500">
              No tweets found
            </div>
          )}
      </TweetGrid>
    </SocialSection>
  );
};

export default SocialFeed;
