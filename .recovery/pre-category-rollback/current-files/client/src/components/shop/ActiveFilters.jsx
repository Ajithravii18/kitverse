import React from 'react';

export default function ActiveFilters({ filters, removeFilter, clearAll }) {
  const activeKeys = Object.keys(filters).filter(k => filters[k]);
  
  if (activeKeys.length === 0) return null;

  return (
    <div className="active-filters">
      {activeKeys.map(k => (
        <button key={k} className="filter-chip" onClick={() => removeFilter(k)}>
          {k}: {filters[k]} <span>×</span>
        </button>
      ))}
      <button className="clear-all-chip" onClick={clearAll}>Clear all</button>
    </div>
  );
}
