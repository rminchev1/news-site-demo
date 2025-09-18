import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
  return (
    <header className="site-header" aria-label="ArcXP - Poool header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo-mark" role="img" aria-label="ArcXP logo" />
          <div className="brand">ArcXP - Poool (app)</div>
        </div>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <a href="#">World</a>
          <a href="#">Business</a>
          <a href="#">Technology</a>
          <a href="#">Culture</a>
        </nav>

        <div className="header-actions">
          <input className="search" placeholder="Search stories, topics..." aria-label="Search" />
          <button className="subscribe">Subscribe</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
