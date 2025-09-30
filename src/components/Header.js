import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="site-header" aria-label="ArcXP - Poool header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo-mark" role="img" aria-label="ArcXP logo" />
          <div className="brand">ArcXP - Poool (app)</div>
        </div>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <button className="nav-link">World</button>
          <button className="nav-link">Business</button>
          <button className="nav-link">Technology</button>
          <button className="nav-link">Culture</button>
        </nav>

        <div className="header-actions">
          <input className="search" placeholder="Search stories, topics..." aria-label="Search" />
          
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <span className="user-avatar">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
                <span className="user-name">{user?.firstName}</span>
                <svg className="chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-info">
                      <div className="user-name-full">{user?.fullName}</div>
                      <div className="user-email">{user?.email}</div>
                    </div>
                  </div>
                  <div className="user-menu-divider"></div>
                  <div className="user-menu-items">
                    <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      <span>Profile</span>
                    </Link>
                    <Link to="/favorites" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      <span>Favorites</span>
                    </Link>
                    <Link to="/settings" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      <span>Settings</span>
                    </Link>
                  </div>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-item logout" onClick={handleLogout}>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">Sign In</Link>
              <Link to="/register" className="subscribe">Subscribe</Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {showUserMenu && (
        <div className="user-menu-overlay" onClick={() => setShowUserMenu(false)} />
      )}
    </header>
  );
};

export default Header;
