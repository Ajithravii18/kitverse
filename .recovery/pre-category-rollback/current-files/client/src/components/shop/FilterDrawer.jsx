import React, { useEffect, useRef } from 'react';
import { qualities } from '../../../../shared/catalog.js';

export default function FilterDrawer({ isOpen, onClose, filters, updateParams, applyFilters }) {
  const drawerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus?.();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') {
      const focusable = [...drawerRef.current.querySelectorAll('button, input, select, a[href], [tabindex]:not([tabindex="-1"])')]
        .filter(element => !element.disabled && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="filter-drawer-overlay" onClick={onClose}>
      <div 
        className="filter-drawer" 
        role="dialog" 
        aria-label="Filters" 
        aria-modal="true"
        ref={drawerRef}
        tabIndex="-1"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="filter-drawer-header">
          <h3>Filters</h3>
          <button onClick={onClose} aria-label="Close filters">×</button>
        </div>
        <div className="filter-drawer-body">
          <div className="filter-group">
            <h4>Quality</h4>
            {qualities.map(q => (
              <label key={q}>
                <input 
                  type="checkbox" 
                  checked={filters.quality === q} 
                  onChange={() => updateParams({ quality: filters.quality === q ? null : q })}
                />
                {q}
              </label>
            ))}
          </div>
        </div>
        <div className="filter-drawer-footer">
          <button className="secondary" onClick={() => updateParams({ quality: null })}>Clear all</button>
          <button className="primary" onClick={applyFilters}>Apply</button>
        </div>
      </div>
    </div>
  );
}
