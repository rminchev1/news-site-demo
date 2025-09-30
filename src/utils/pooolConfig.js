// Poool configuration utility for handling authentication-based paywall scenarios
import { useAuth } from '../context/AuthContext';

/**
 * Get Poool configuration based on user authentication and subscription status
 * @param {object} user - The authenticated user object
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {object} Poool configuration object
 */
export const getPooolConfig = (user, isAuthenticated) => {
  // Base configuration
  const baseConfig = {
    cookies_enabled: true,
    debug: process.env.NODE_ENV === 'development',
  };

  // If user is authenticated, they get full premium access
  if (isAuthenticated && user) {
    return {
      ...baseConfig,
      // Tell Poool the user is authenticated with premium access
      user_is_authenticated: true,
      
      // Pass user information to Poool for analytics
      user: {
        id: user.id || user._id,
        email: user.email,
        subscription_status: 'premium', // All authenticated users are treated as premium
        registration_date: user.createdAt,
        
        // Custom user segments for analytics
        segments: [
          'authenticated_user',
          'premium_access',
          user.preferences?.newsletter ? 'newsletter_subscriber' : 'no_newsletter',
          ...(user.favoriteArticles?.length > 5 ? ['engaged_reader'] : []),
        ],
      },
      
      // Scenario configuration for authenticated users (premium access)
      scenario: 'authenticated_premium_access',
      
      // Premium access configuration
      premium_access: {
        unlimited_articles: true,
        full_content_access: true,
        no_paywall: true,
      },
      
      // Custom texts for authenticated users (not really needed since no paywall)
      texts: {
        welcome_message: 'Welcome back! Enjoy unlimited access to all content.',
      },
    };
  }

  // Configuration for non-authenticated users
  return {
    ...baseConfig,
    user_is_authenticated: false,
    scenario: 'anonymous_paywall',
    
    // Configure 3 free articles for unauthenticated users
    user: {
      // Poool will track anonymous users via cookies/localStorage
      anonymous_user_id: 'anonymous',
    },
    
    // Custom texts and URLs for anonymous users
    texts: {
      title: "Continue Reading",
      subtitle: "Create a free account to access all premium content",
      login_button: "Sign In",
      signup_button: "Create Free Account",
      subscription_button: "Get Premium Access",
      
      // Custom call-to-action messages
      free_articles_remaining: "free articles remaining",
      free_articles_consumed: "You've used your free articles",
      value_proposition: "Sign up for unlimited access to premium content",
    },
    
    // Custom URLs for Poool buttons
    urls: {
      login: '/login',
      signup: '/register',
      subscription: '/register', // Sign up for premium access
    },
    
    // Paywall behavior for anonymous users
    paywall: {
      // Show partial content before paywall
      free_content_percentage: 40, // Show 40% of content for free
      
      // Configure free articles limit
      free_articles_limit: 3, // Allow 3 free articles
      
      // Paywall positioning
      position: 'middle', // 'top', 'middle', 'bottom'
      
      // Allow social sharing before paywall
      enable_social_sharing: true,
      
      // Track article views for free article counting
      track_article_views: true,
    },
    
    // Premium access configuration
    premium_access: {
      // What authenticated users get
      unlimited_articles: true,
      full_content_access: true,
    },
  };
};

/**
 * Get Poool scenario name based on user status
 * @param {object} user - The authenticated user object  
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {string} Scenario name
 */
export const getPooolScenario = (user, isAuthenticated) => {
  if (!isAuthenticated) {
    return 'anonymous_3_free_articles';
  }
  
  // All authenticated users get premium access regardless of subscription status
  return 'authenticated_premium_access';
};

/**
 * Determine if paywall should be shown based on user status
 * @param {object} user - The authenticated user object
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {boolean} Whether to show paywall
 */
export const shouldShowPaywall = (user, isAuthenticated) => {
  // Authenticated users get full access to premium content (no paywall)
  if (isAuthenticated) {
    return false;
  }
  
  // Unauthenticated users get paywall after viewing some free content
  // The paywall will be configured to allow 3 free articles
  return true;
};

/**
 * React hook for Poool configuration
 * @returns {object} Poool configuration and utilities
 */
export const usePooolConfig = () => {
  const { user, isAuthenticated } = useAuth();
  
  return {
    config: getPooolConfig(user, isAuthenticated),
    scenario: getPooolScenario(user, isAuthenticated),
    shouldShowPaywall: shouldShowPaywall(user, isAuthenticated),
    isAuthenticated,
    user,
  };
};

// Poool event handlers
export const PooolEventHandlers = {
  // Handle successful subscription
  onSubscribe: (data) => {
    console.log('User subscribed:', data);
    // You might want to update user state, redirect, etc.
    window.location.reload(); // Simple reload to refresh user state
  },
  
  // Handle successful login through Poool
  onLogin: (data) => {
    console.log('User logged in through Poool:', data);
    // Redirect to login page
    window.location.href = '/login';
  },
  
  // Handle signup click from Poool
  onSignup: (data) => {
    console.log('User clicked signup through Poool:', data);
    // Redirect to register page
    window.location.href = '/register';
  },
  
  // Handle paywall display
  onPaywallDisplay: (data) => {
    console.log('Paywall displayed:', data);
    // Analytics tracking, etc.
  },
  
  // Handle content unlock
  onContentUnlock: (data) => {
    console.log('Content unlocked:', data);
    // Analytics tracking
  },
};

const pooolUtils = {
  getPooolConfig,
  getPooolScenario,
  shouldShowPaywall,
  usePooolConfig,
  PooolEventHandlers,
};

export default pooolUtils;