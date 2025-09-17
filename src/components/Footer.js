import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer" aria-label="ArcXP - Poool footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="brand">ArcXP - Poool (app)</div>
          <p className="muted">© {new Date().getFullYear()} ArcXP - Poool — All rights reserved.</p>
        </div>

        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
