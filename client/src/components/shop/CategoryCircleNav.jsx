import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { label: 'All Products', type: 'all', fallback: 'All' },
  { label: 'Jerseys', type: 'jersey', fallback: 'J' },
  { label: 'Embroidery', type: 'jersey', quality: 'Embroidery', fallback: 'E' },
  { label: 'First copy + shorts', type: 'jersey', quality: 'First copy + shorts', fallback: 'F' },
  { label: 'Master copy', type: 'jersey', quality: 'Master copy', fallback: 'M' },
  { label: 'Player version', type: 'jersey', quality: 'Player version', fallback: 'P' },
  { label: 'Retro', retro: 'true', fallback: 'R' },
  { label: 'Collar T-Shirts', type: 'collar-tshirt', fallback: 'C' },
  { label: 'Shorts', type: 'shorts', fallback: 'S' },
  { label: 'Track Pants', type: 'track-pants', fallback: 'T' },
  { label: 'Club Teams', category: 'club', fallback: 'CT' },
  { label: 'National Teams', category: 'national', fallback: 'NT' }
];

export default function CategoryCircleNav() {
  const navigate = useNavigate();

  const handleNav = (e, cat) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (cat.type && cat.type !== 'all') params.set('type', cat.type);
    if (cat.quality) params.set('quality', cat.quality);
    if (cat.category) params.set('category', cat.category);
    if (cat.retro) params.set('retro', cat.retro);
    navigate('/shop?' + params.toString());
  };

  return (
    <div className="category-circle-nav-container" style={{ width: '100%', borderBottom: '1px solid #222', background: '#000', overflow: 'hidden' }}>
      <div className="category-circle-nav" style={{ 
        display: 'flex', gap: '30px', padding: '30px 20px', overflowX: 'auto', 
        scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', margin: '0 auto', maxWidth: '1200px'
      }}>
        {CATEGORIES.map((cat, i) => (
          <a 
            key={i} 
            href={`/shop?${cat.type && cat.type !== 'all' ? 'type='+cat.type : ''}`}
            onClick={(e) => handleNav(e, cat)}
            className="category-circle-link"
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '90px', 
              textDecoration: 'none', color: '#fff', position: 'relative'
            }}
            aria-label={`Shop ${cat.label}`}
          >
            <div className="circle-crop" style={{ 
              width: '90px', height: '90px', borderRadius: '50%', border: '1px solid #333', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              background: '#111', marginBottom: '15px', position: 'relative', overflow: 'hidden'
            }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--lime)', opacity: 0.5 }}>{cat.fallback}</span>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', background: 'var(--lime)', color: '#000', padding: '2px 0', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {cat.label}
              </div>
            </div>
          </a>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .category-circle-nav::-webkit-scrollbar { display: none; }
        .category-circle-link:hover .circle-crop { border-color: var(--lime); }
      `}} />
    </div>
  );
}
