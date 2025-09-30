import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SubscriptionStatus = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="subscription-status">
        <div className="subscription-banner">
          <span className="subscription-text">
            📰 3 free articles, then sign up for unlimited access
          </span>
          <Link to="/register" className="subscription-cta">
            Sign Up Free
          </Link>
        </div>
      </div>
    );
  }

  // All authenticated users get premium access
  return (
    <div className="subscription-status">
      <div className="subscription-banner premium">
        <span className="subscription-text">
          ✨ Welcome back, {user?.firstName || 'Reader'}! Unlimited access to all content
        </span>
        <Link to="/profile" className="subscription-cta">
          Profile
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionStatus;