import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';


const ArticleCard = ({ id, title, excerpt, content, author, date }) => {
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Use full content when available, otherwise fall back to excerpt
  const source = content || excerpt || '';
  const preview = source.length > 150 ? source.slice(0, 150).trimEnd() + '…' : source;

  useEffect(() => {
    // Check if this article is in user's favorites
    if (isAuthenticated && user?.favoriteArticles) {
      setIsFavorite(user.favoriteArticles.includes(id));
    }
  }, [isAuthenticated, user, id]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking favorite button
    
    if (!isAuthenticated) {
      // Could redirect to login or show a modal
      return;
    }

    setIsTogglingFavorite(true);
    
    try {
      if (isFavorite) {
        await userAPI.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await userAPI.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Could show an error message to user
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <article className="card">
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">
            {title}
          </h3>
          {isAuthenticated && (
            <button
              className={`favorite-button ${isFavorite ? 'active' : ''} ${isTogglingFavorite ? 'loading' : ''}`}
              onClick={toggleFavorite}
              disabled={isTogglingFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isTogglingFavorite ? (
                <span className="favorite-loading">⋯</span>
              ) : (
                <span className="favorite-icon">{isFavorite ? '❤️' : '🤍'}</span>
              )}
            </button>
          )}
        </div>
        <p className="card-excerpt">{preview}</p>
        <div className="card-meta">
          <span className="card-author">{author}</span>
          <span className="card-date">{date}</span>
        </div>
        <Link className="card-readmore" to={`/article/${id}`}>Read more →</Link>
      </div>
    </article>
  );
};

export default ArticleCard;
