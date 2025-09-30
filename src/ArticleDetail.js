import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { userAPI } from './services/api';
import { usePooolConfig, PooolEventHandlers } from './utils/pooolConfig';
import articles from './data/articles';
import Header from './components/Header';
import Footer from './components/Footer';
import SubscriptionStatus from './components/SubscriptionStatus';
import FreeArticleCounter from './components/FreeArticleCounter';
import './Home.css';
import {
  AccessContext,
  RestrictedContent,
  Paywall,
  Pixel,
} from '@poool/react-access';


const ArticleDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { config: pooolConfig, shouldShowPaywall: showPaywall } = usePooolConfig();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const article = articles.find((a) => String(a.id) === id);
  const contentRef = useRef(null);

  useEffect(() => {
    // Check if this article is in user's favorites
    if (isAuthenticated && user?.favoriteArticles && article) {
      setIsFavorite(user.favoriteArticles.includes(article.id));
    }
  }, [isAuthenticated, user, article]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || !article) return;

    setIsTogglingFavorite(true);
    
    try {
      if (isFavorite) {
        await userAPI.removeFavorite(article.id);
        setIsFavorite(false);
      } else {
        await userAPI.addFavorite(article.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (!article) {
    return (    
      <div className="app">
        <Header />
        <main className="article-main">
          <p>Article not found.</p>
          <Link to="/">Back</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const paragraphs = article.content.split(/\n\n+/).map((p, i) => p.trim()).filter(Boolean);

  return (
    <div className="app">
      <Header />
      <SubscriptionStatus />
      <FreeArticleCounter articleId={article.id} isAuthenticated={isAuthenticated} />

      {/* poool integration: conditionally apply paywall based on user status */}
      {!showPaywall ? (
        /* All authenticated users get full premium access */
        <main className="article-main">
          <div className="article-header">
            <div className="article-title-section">
              <h1 className="article-title">
                {article.title}
                <span className="premium-badge">Premium Access</span>
              </h1>
              <div className="article-meta">{article.author} · {article.date}</div>
            </div>
            <button
              className={`favorite-button-large ${isFavorite ? 'active' : ''} ${isTogglingFavorite ? 'loading' : ''}`}
              onClick={toggleFavorite}
              disabled={isTogglingFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isTogglingFavorite ? (
                <span className="favorite-loading">⋯</span>
              ) : (
                <span className="favorite-icon">{isFavorite ? '❤️' : '🤍'}</span>
              )}
              <span className="favorite-text">
                {isFavorite ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>

          {/* Full article content for authenticated users */}
          <div className="article-body">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Track page view for users with full access */}
          <Pixel type="page-view" data={{ 
            type: isAuthenticated ? 'authenticated' : 'premium_access', 
            articleId: article.id,
            user_status: user?.subscription?.status || 'free'
          }} />

          <Link to="/">← Back to home</Link>
        </main>
      ) : (
        /* Unauthenticated users get paywall after 3 free articles */
        <AccessContext
          appId="3TCCE-QEOD2-1FBEY-BDMKQ"
          config={pooolConfig}
          withAudit={true}
          events={PooolEventHandlers}
        >
          <main className="article-main">
            <div className="article-header">
              <div className="article-title-section">
                <h1 className="article-title">{article.title}</h1>
                <div className="article-meta">{article.author} · {article.date}</div>
              </div>
              {/* Show appropriate actions based on user status */}
              {isAuthenticated ? (
                <button
                  className={`favorite-button-large ${isFavorite ? 'active' : ''} ${isTogglingFavorite ? 'loading' : ''}`}
                  onClick={toggleFavorite}
                  disabled={isTogglingFavorite}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isTogglingFavorite ? (
                    <span className="favorite-loading">⋯</span>
                  ) : (
                    <span className="favorite-icon">{isFavorite ? '❤️' : '🤍'}</span>
                  )}
                  <span className="favorite-text">
                    {isFavorite ? 'Saved' : 'Save'}
                  </span>
                </button>
              ) : (
                <div className="auth-prompt">
                  <Link to="/register" className="auth-link">
                    Sign up to save articles
                  </Link>
                </div>
              )}
            </div>

            {/* RestrictedContent with paywall for non-authenticated users */}
            <RestrictedContent ref={contentRef}>
              <div className="article-body">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </RestrictedContent>

            {/* Paywall component with dynamic configuration */}
            <Paywall 
              contentRef={contentRef}
              onSubscribe={PooolEventHandlers.onSubscribe}
              onLogin={PooolEventHandlers.onLogin}
              onSignup={PooolEventHandlers.onSignup}
              onPaywallDisplay={PooolEventHandlers.onPaywallDisplay}
              onContentUnlock={PooolEventHandlers.onContentUnlock}
            />
            <Pixel type="page-view" data={{ type: 'premium', articleId: article.id }} />

            <Link to="/">← Back to home</Link>
          </main>
        </AccessContext>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
