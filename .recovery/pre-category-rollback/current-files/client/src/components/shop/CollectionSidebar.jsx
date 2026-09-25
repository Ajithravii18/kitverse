import React from 'react';
import { NavLink } from 'react-router-dom';
import { collectionsConfig } from '../../../../shared/collections.js';
import { qualities } from '../../../../shared/catalog.js';

export default function CollectionSidebar({ filters, updateParams }) {
  const groups = [
    { title: 'Shop by product', filters: ['jerseys', 'shorts', 'track-pants'] },
    { title: 'Shop by quality', filters: ['first-copy-shorts', 'master-copy', 'player-version', 'embroidery'] },
    { title: 'Shop by style', filters: ['retro', 'collar'] },
    { title: 'Shop by team', filters: ['club-teams', 'national-teams'] }
  ];

  return (
    <aside className="collection-sidebar">
      <nav className="sidebar-nav">
        <div className="sidebar-group">
          <NavLink to="/shop" end className={({ isActive }) => isActive ? 'active' : ''}>All products</NavLink>
        </div>
        {groups.map(g => (
          <div className="sidebar-group" key={g.title}>
            <h4 className="sidebar-group-title">{g.title}</h4>
            {g.filters.map(slug => {
              const col = collectionsConfig.find(c => c.slug === slug);
              if (!col) return null;
              return (
                <NavLink key={slug} to={`/collections/${slug}`} className={({ isActive }) => isActive ? 'active' : ''}>
                  {col.label}
                </NavLink>
              );
            })}
          </div>
        ))}

        {updateParams && (
          <div className="sidebar-group desktop-filters">
            <h4 className="sidebar-group-title">Filter by Quality</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {qualities.map(q => (
                <label key={q} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="checkbox" 
                    checked={filters?.quality === q} 
                    onChange={() => updateParams({ quality: filters?.quality === q ? null : q })}
                  />
                  {q}
                </label>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
