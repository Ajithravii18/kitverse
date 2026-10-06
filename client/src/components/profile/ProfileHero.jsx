import React from 'react';
import { money } from '../../format.js';

export default function ProfileHero({ user, orders, paidOrders, totalSpent }) {
  return (
    <section className="profile-hero" style={{ paddingTop: "120px" }} aria-labelledby="profile-hero-title">
      <div className="profile-hero-meta"><span>MEMBER FILE / 01</span><span>KITVERSE ARCHIVE / PRIVATE CLIENT</span><span>SESSION ACTIVE <i aria-hidden="true" /></span></div>
      <div className="profile-hero-main">
        <div className="profile-hero-title-block">
          <span className="profile-hero-eyebrow">YOUR KITVERSE / ACCOUNT OVERVIEW</span>
          <h1 id="profile-hero-title">YOUR MATCHDAY<br /><em>ARCHIVE.</em></h1>
        </div>
        <div className="profile-hero-member">
          <span>ARCHIVE MEMBER</span>
          <strong>{user.username || user.email}</strong>
          <span>{user.email}</span>
          <div className="profile-hero-stats">
            <div><b>{String(orders.length).padStart(2, '0')}</b><span>ORDERS</span></div>
            <div><b>{String(paidOrders).padStart(2, '0')}</b><span>COMPLETED</span></div>
            <div><b>{money(totalSpent)}</b><span>COLLECTED VALUE</span></div>
          </div>
        </div>
      </div>
      <div className="profile-hero-footer"><span>PRIVATE CLIENT / KV—2024</span><span>ORDERS, TRACKING &amp; ACCOUNT SETTINGS</span></div>
    </section>
  );
}
