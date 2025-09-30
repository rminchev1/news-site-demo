import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleCard from '../components/ArticleCard';
import articles from '../data/articles';
import './Favorites.css';

const Favorites = () => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getFavorites();
      if (response.data.success) {
        setFavoriteIds(response.data.favoriteArticles);
      }
    } catch (error) {
      setError('Failed to load favorite articles');
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Header />
        <div className="favorites-container">
          <div className="favorites-empty">
            <div className="empty-icon">🔒</div>
            <h2>Sign In Required</h2>
            <p>Please sign in to view your favorite articles.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="app">
        <Header />
        <div className="favorites-container">
          <div className="favorites-loading">Loading your favorites...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="favorites-container">
          <div className="favorites-error">
            <div className="error-icon">⚠️</div>
            <h2>Error Loading Favorites</h2>
            <p>{error}</p>
            <button onClick={fetchFavorites} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Filter articles to only show favorites
  const favoriteArticles = articles.filter(article => 
    favoriteIds.includes(article.id)
  );

  return (
    <div className="app">
      <Header />
      
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Your Favorite Articles</h1>
          <p>Articles you've saved for later reading</p>
        </div>

        {favoriteArticles.length === 0 ? (
          <div className="favorites-empty">
            <div className="empty-icon">📖</div>
            <h2>No Favorites Yet</h2>
            <p>
              Start building your reading list by clicking the heart icon on articles you want to save.
            </p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Favorites;