import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer" aria-label="ArcXP - Poool footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="brand">ArcXP - Poool (app)</div>
          <p className="muted">© {new Date().getFullYear()} ArcXP - Poool — All rights reserved.</p>
          <p className="ai-notice">⚡ Developed with AI assistance (GitHub Copilot)</p>
        </div>

        <div className="footer-links">
          <button className="footer-link">About</button>
          <button className="footer-link">Contact</button>
          <button className="footer-link">Privacy</button>
          <button className="footer-link">Terms</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
