const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Shop.jsx', 'utf-8');

const oldSidebar = `<aside className="shop-sidebar" style={{ width: '280px', padding: '60px 40px', borderRight: '1px solid #d9dcd3' }}>
          <div style={{ position: 'sticky', top: '100px' }}>
            
            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: 'var(--muted)' }}>Product Type</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[
                  { label: 'All Products', val: 'all' },
                  { label: 'Jerseys', val: 'jersey' },
                  { label: 'Shorts', val: 'shorts' },
                  { label: 'Track Pants', val: 'track-pants' },
                  { label: 'Collar T-Shirts', val: 'collar-tshirt' }
                ].map(t => (
                  <button key={t.val} onClick={() => updateFilter('type', t.val)} style={{ background: 'none', border: 'none', color: type === t.val ? 'var(--ink)' : 'var(--muted)', fontWeight: type === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: 'var(--muted)' }}>Team Category</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                  <button key={t.val} onClick={() => updateFilter('category', t.val)} style={{ background: 'none', border: 'none', color: category === t.val ? 'var(--ink)' : 'var(--muted)', fontWeight: category === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: 'var(--muted)' }}>Quality Tier</div>
              <select className="select-dark" value={quality} onChange={e => updateFilter('quality', e.target.value)} style={{ width: '100%', padding: '12px', background: '#fff', color: 'var(--ink)', border: '1px solid #d9dcd3', borderRadius: '4px' }}>
                <option value="All qualities">All Qualities</option>
                {qualities.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '50px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: retro ? 'var(--ink)' : 'var(--muted)', fontWeight: retro ? '700' : '400' }}>
                <input type="checkbox" checked={retro} onChange={e => updateFilter('retro', e.target.checked)} style={{ accentColor: 'var(--ink)', width: '16px', height: '16px' }} /> 
                Retro Styles
              </label>
            </div>

            <button onClick={clearFilters} style={{ background: 'transparent', border: '1px solid #333', color: 'var(--muted)', padding: '10px 20px', width: '100%', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Clear Filters</button>
          </div>
        </aside>`;

const newSidebar = `<aside className="shop-sidebar" style={{ width: '280px', padding: '60px 40px', background: 'var(--ink)', color: 'var(--paper)', borderRight: 'none', boxShadow: '4px 0 20px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'sticky', top: '100px' }}>
            
            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#6f726a' }}>Product Type</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[
                  { label: 'All Products', val: 'all' },
                  { label: 'Jerseys', val: 'jersey' },
                  { label: 'Shorts', val: 'shorts' },
                  { label: 'Track Pants', val: 'track-pants' },
                  { label: 'Collar T-Shirts', val: 'collar-tshirt' }
                ].map(t => (
                  <button key={t.val} onClick={() => updateFilter('type', t.val)} style={{ background: 'none', border: 'none', color: type === t.val ? 'var(--lime)' : '#a1a39f', fontWeight: type === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s ease' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#6f726a' }}>Team Category</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                  <button key={t.val} onClick={() => updateFilter('category', t.val)} style={{ background: 'none', border: 'none', color: category === t.val ? 'var(--lime)' : '#a1a39f', fontWeight: category === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s ease' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#6f726a' }}>Quality Tier</div>
              <select className="select-dark" value={quality} onChange={e => updateFilter('quality', e.target.value)} style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}>
                <option value="All qualities">All Qualities</option>
                {qualities.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '50px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: retro ? 'var(--lime)' : '#a1a39f', fontWeight: retro ? '700' : '400', transition: 'color 0.2s ease' }}>
                <input type="checkbox" checked={retro} onChange={e => updateFilter('retro', e.target.checked)} style={{ accentColor: 'var(--lime)', width: '16px', height: '16px' }} /> 
                Retro Styles
              </label>
            </div>

            <button onClick={clearFilters} style={{ background: 'transparent', border: '1px solid #333', color: '#a1a39f', padding: '12px 20px', width: '100%', cursor: 'pointer', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em', borderRadius: '4px', transition: 'background 0.2s ease' }}>Clear Filters</button>
          </div>
        </aside>`;

c = c.replace(oldSidebar, newSidebar);

// Also remove the "margin: '0 auto', maxWidth: '1440px'" from shop-layout if present, so the dark sidebar hits the edge of the screen like a true SaaS app
c = c.replace(/className="shop-layout" style=\{\{ display: 'flex', minHeight: '100vh', background: 'var\(--paper\)', color: 'var\(--ink\)', margin: '0 auto', maxWidth: '1440px' \}\}/g, 'className="shop-layout" style={{ display: \'flex\', minHeight: \'100vh\', background: \'var(--paper)\', color: \'var(--ink)\' }}');

fs.writeFileSync('client/src/pages/Shop.jsx', c);
console.log('Sidebar transformed into SaaS dark theme.');
