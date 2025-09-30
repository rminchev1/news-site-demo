import React from 'react';
import { Link } from 'react-router-dom';
import { useFreeArticleTracking } from '../utils/freeArticleTracker';

const FreeArticleCounter = ({ articleId, isAuthenticated }) => {
  const stats = useFreeArticleTracking(articleId);

  // Don't show counter for authenticated users
  if (isAuthenticated) {
    return null;
  }

  // Show different messages based on usage
  if (stats.hasExceeded) {
    return (
      <div className="free-article-counter exceeded">
        <div className="counter-content">
          <div className="counter-icon">🔒</div>
          <div className="counter-text">
            <div className="counter-title">Free articles limit reached</div>
            <div className="counter-subtitle">
              Sign up for unlimited access to all premium content
            </div>
          </div>
          <Link to="/register" className="counter-cta primary">
            Sign Up Free
          </Link>
        </div>
      </div>
    );
  }

  if (stats.remaining === 1) {
    return (
      <div className="free-article-counter warning">
        <div className="counter-content">
          <div className="counter-icon">⚠️</div>
          <div className="counter-text">
            <div className="counter-title">Last free article!</div>
            <div className="counter-subtitle">
              Sign up now for unlimited access after this article
            </div>
          </div>
          <Link to="/register" className="counter-cta secondary">
            Sign Up Free
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="free-article-counter active">
      <div className="counter-content">
        <div className="counter-icon">📖</div>
        <div className="counter-text">
          <div className="counter-title">
            {stats.remaining} free article{stats.remaining !== 1 ? 's' : ''} remaining
          </div>
          <div className="counter-subtitle">
            Sign up for unlimited access to all content
          </div>
        </div>
        <div className="counter-progress">
          <div 
            className="counter-progress-bar" 
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <Link to="/register" className="counter-cta tertiary">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default FreeArticleCounter;