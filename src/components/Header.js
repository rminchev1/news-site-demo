import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <div className="logo-mark" />
          <div className="brand">poool</div>
        </div>

        <nav className="header-nav">
          <a href="#">Home</a>
          <a href="#">World</a>
          <a href="#">Business</a>
          <a href="#">Technology</a>
          <a href="#">Culture</a>
        </nav>

        <div className="header-actions">
          <input className="search" placeholder="Search stories, topics..." />
          <button className="subscribe">Subscribe</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
