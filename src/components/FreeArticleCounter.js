import React from 'react';
import { Link } from 'react-router-dom';

const FreeArticleCounter = ({ isAuthenticated }) => {
  // Don't show counter for authenticated users
  if (isAuthenticated) {
    return null;
  }

  // Simple promotional banner - let Poool handle the actual article counting and paywall
  return (
    <div className="free-article-counter active">
      <div className="counter-content">
        <div className="counter-icon">📖</div>
        <div className="counter-text">
          <div className="counter-title">
            Limited free articles per month
          </div>
          <div className="counter-subtitle">
            Sign up for unlimited access to all content
          </div>
        </div>
        <Link to="/register" className="counter-cta tertiary">
          Sign Up Free
        </Link>
      </div>
    </div>
  );
};

export default FreeArticleCounter;