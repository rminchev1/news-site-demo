// Utility for tracking free article views for unauthenticated users
import React from 'react';

const FREE_ARTICLES_LIMIT = 3;
const STORAGE_KEY = 'freeArticlesViewed';
const STORAGE_TIMESTAMP_KEY = 'freeArticlesTimestamp';

/**
 * Get the list of articles viewed this month by unauthenticated users
 * @returns {Array} Array of article IDs
 */
export const getViewedArticles = () => {
  try {
    const timestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Check if we need to reset the counter (new month)
    if (timestamp) {
      const storedDate = new Date(parseInt(timestamp));
      if (storedDate.getMonth() !== currentMonth || storedDate.getFullYear() !== currentYear) {
        // Reset for new month
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
        return [];
      }
    } else {
      // First time, set timestamp
      localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
    }
    
    const viewed = localStorage.getItem(STORAGE_KEY);
    return viewed ? JSON.parse(viewed) : [];
  } catch (error) {
    console.warn('Error reading viewed articles:', error);
    return [];
  }
};

/**
 * Add an article to the viewed list
 * @param {string|number} articleId - The article ID
 */
export const addViewedArticle = (articleId) => {
  try {
    const viewed = getViewedArticles();
    if (!viewed.includes(articleId)) {
      viewed.push(articleId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
    }
  } catch (error) {
    console.warn('Error adding viewed article:', error);
  }
};

/**
 * Get remaining free articles count
 * @returns {number} Number of free articles remaining
 */
export const getRemainingFreeArticles = () => {
  const viewed = getViewedArticles();
  return Math.max(0, FREE_ARTICLES_LIMIT - viewed.length);
};

/**
 * Check if user has exceeded free article limit
 * @returns {boolean} True if user has exceeded limit
 */
export const hasExceededFreeLimit = () => {
  return getRemainingFreeArticles() === 0;
};

/**
 * Check if this is the user's first article view this month
 * @returns {boolean} True if first view
 */
export const isFirstArticleView = () => {
  const viewed = getViewedArticles();
  return viewed.length === 0;
};

/**
 * Get free articles statistics
 * @returns {object} Stats object
 */
export const getFreeArticleStats = () => {
  const viewed = getViewedArticles();
  const remaining = getRemainingFreeArticles();
  
  return {
    viewed: viewed.length,
    remaining,
    limit: FREE_ARTICLES_LIMIT,
    hasExceeded: hasExceededFreeLimit(),
    percentage: Math.round((viewed.length / FREE_ARTICLES_LIMIT) * 100),
  };
};

/**
 * React hook for free article tracking
 * @param {string|number} articleId - Current article ID
 * @returns {object} Free article stats and functions
 */
export const useFreeArticleTracking = (articleId) => {
  const [stats, setStats] = React.useState(getFreeArticleStats());
  
  React.useEffect(() => {
    // Track this article view
    if (articleId) {
      addViewedArticle(articleId);
      setStats(getFreeArticleStats());
    }
  }, [articleId]);
  
  return {
    ...stats,
    trackView: (id) => {
      addViewedArticle(id);
      setStats(getFreeArticleStats());
    },
  };
};

const freeArticleTracker = {
  getViewedArticles,
  addViewedArticle,
  getRemainingFreeArticles,
  hasExceededFreeLimit,
  isFirstArticleView,
  getFreeArticleStats,
  useFreeArticleTracking,
};

export default freeArticleTracker;