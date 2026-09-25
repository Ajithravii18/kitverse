import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function SiteHeader({ menu, setMenu, setBag, authCustomer, cartCount }) {
  const mainLinks = [
    { label: 'All Jerseys', to: '/shop' },
    { label: 'Club Teams', to: '/collections/club-teams' },
    { label: 'National Teams', to: '/collections/national-teams' }
  ];

  return (
    <header className="site-header">
      <div className="nav-main">
        <Link to="/" className="logo" aria-label="KITVERSE home" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          KITVERSE
        </Link>
        <nav aria-label="Main navigation">
          {mainLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? 'current' : ''}>{link.label}</NavLink>
          ))}
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: 'auto' }}>
          {authCustomer ? (
            <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>Profile</Link>
          ) : (
            <Link to="/auth" style={{ textDecoration: 'none', color: 'var(--text)', fontSize: '13px', fontWeight: 'bold' }}>Sign In</Link>
          )}
          <button className="bag" onClick={() => setBag(true)} aria-label={`Shopping bag, ${cartCount} items`}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 7V6a4 4 0 0 1 8 0v1"/></svg>
            <span className="bag-label">Bag</span><span className="bag-count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
