import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter({ setInfo }) {
  return (
    <footer className="site-footer reveal">
      <div className="footer-top">
        <div className="footer-brand">
          <Link className="logo" to="/">KITVERSE</Link>
          <p>Explore club and national team jerseys. Club loyalty. National pride. One love for the game.</p>
          <div className="footer-socials">
            <a href="#" className="social-pill" aria-label="Instagram">IG</a>
            <a href="#" className="social-pill" aria-label="Twitter">X</a>
            <a href="#" className="social-pill" aria-label="Facebook">FB</a>
          </div>
        </div>
        <div className="footer-links-group">
          <h4>Shop</h4>
          <nav>
            <Link to="/shop">All Jerseys</Link>
            <Link to="/collections/club-teams">Club Teams</Link>
            <Link to="/collections/national-teams">National Teams</Link>
          </nav>
        </div>
        <div className="footer-links-group">
          <h4>Info</h4>
          <nav>
            <button type="button" onClick={() => setInfo('Sizing Guide')}>Sizing Guide</button>
            <button type="button" onClick={() => setInfo('Shipping & Returns')}>Shipping & Returns</button>
            <button type="button" onClick={() => setInfo('Contact Us')}>Contact Us</button>
            <button type="button" onClick={() => setInfo('About KITVERSE')}>About KITVERSE</button>
          </nav>
        </div>
      </div>
      <div className="footer-slogan">
        <h2>FIND YOUR COLOURS.</h2>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span>© 2026 KITVERSE. All rights reserved.</span>
          <span className="footer-disclaimer">Concept storefront · Images illustrative · No official club affiliation claimed.</span>
        </div>
        <div className="footer-bottom-badges">
          <span className="payment-badge">VISA</span>
          <span className="payment-badge">MASTERCARD</span>
          <span className="payment-badge">UPI</span>
        </div>
      </div>
    </footer>
  );
}
