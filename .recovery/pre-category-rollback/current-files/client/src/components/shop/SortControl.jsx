import React from 'react';

export default function SortControl({ sort, setSort }) {
  return (
    <div className="sort-control">
      <label htmlFor="sort-select">Sort by</label>
      <select id="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="featured">Featured</option>
        <option value="low">Price: low to high</option>
        <option value="high">Price: high to low</option>
        <option value="az">Name: A to Z</option>
      </select>
    </div>
  );
}
