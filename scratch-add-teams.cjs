const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Shop.jsx', 'utf-8');

// 1. Add team extraction from products
const teamParsingStr = `
  const type = params.get('type') || 'all';
  const category = params.get('category') || 'all';
  const quality = params.get('quality') || 'All qualities';
  const retro = params.get('retro') === 'true' ? true : false;
  const sort = params.get('sort') || 'featured';
  const team = params.get('team') || 'all';
  const page = parseInt(params.get('page')) || 1;

  const clubTeams = [...new Set(products.filter(p => p.category === 'club' && p.team).map(p => p.team))].sort();
  const nationalTeams = [...new Set(products.filter(p => p.category === 'national' && p.team).map(p => p.team))].sort();
`;
c = c.replace(/const type = params\.get\('type'\) \|\| 'all';[\s\S]*?const page = parseInt\(params\.get\('page'\)\) \|\| 1;/, teamParsingStr);

// 2. Add team to useScrollReveal
c = c.replace(/useScrollReveal\(\[products\.length, page, type, category, quality, retro, sort\]\);/, 'useScrollReveal([products.length, page, type, category, quality, retro, sort, team]);');

// 3. Add team to filters
c = c.replace(/const filters = \{ type, category, quality, retro, sort \};/, "const filters = { type, category, quality, retro, sort, team: team === 'all' ? null : team };");

// 4. Update updateFilter logic to support multiple
const updateFilterOld = `  const updateFilter = (key, value) => {
    const p = new URLSearchParams(params);
    if (value === 'all' || value === 'All qualities' || value === false) {
      p.delete(key);
    } else {
      p.set(key, value);
    }
    p.set('page', '1');
    setParams(p);
  };`;
const updateFilterNew = `  const updateFilters = (updates) => {
    const p = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) {
      if (value === 'all' || value === 'All qualities' || value === false || value === null) {
        p.delete(key);
      } else {
        p.set(key, value);
      }
    }
    p.set('page', '1');
    setParams(p);
  };

  const updateFilter = (key, value) => updateFilters({ [key]: value });`;
c = c.replace(updateFilterOld, updateFilterNew);

// 5. Update browse and category click logic to reset team
c = c.replace(/const browse = \(val\) => updateFilter\('category', val\);/, "const browse = (val) => updateFilters({ category: val, team: 'all' });");
c = c.replace(/onClick=\{\(\) => updateFilter\('category', t\.val\)\}/g, "onClick={() => updateFilters({ category: t.val, team: 'all' })}");

// 6. Insert Dropdowns into Sidebar
const sidebarCategoryStr = `            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#6f726a' }}>Team Category</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                  <button key={t.val} onClick={() => updateFilters({ category: t.val, team: 'all' })} style={{ background: 'none', border: 'none', color: category === t.val ? 'var(--lime)' : '#a1a39f', fontWeight: category === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s ease' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>`;

const sidebarDropdownsStr = `            <div style={{ marginBottom: '50px' }}>
              <div className="eyebrow" style={{ marginBottom: '20px', color: '#6f726a' }}>Team Category</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start', marginBottom: '25px' }}>
                {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                  <button key={t.val} onClick={() => updateFilters({ category: t.val, team: 'all' })} style={{ background: 'none', border: 'none', color: category === t.val ? 'var(--lime)' : '#a1a39f', fontWeight: category === t.val ? '700' : '400', cursor: 'pointer', padding: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s ease' }}>
                    {t.label}
                  </button>
                ))}
              </nav>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select className="select-dark" value={category === 'club' ? team : 'all'} onChange={e => {
                  if (e.target.value === 'all') updateFilters({ team: 'all' });
                  else updateFilters({ category: 'club', team: e.target.value });
                }} style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}>
                  <option value="all">Select Club Team...</option>
                  {clubTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select className="select-dark" value={category === 'national' ? team : 'all'} onChange={e => {
                  if (e.target.value === 'all') updateFilters({ team: 'all' });
                  else updateFilters({ category: 'national', team: e.target.value });
                }} style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '4px', outline: 'none' }}>
                  <option value="all">Select National Team...</option>
                  {nationalTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>`;

c = c.replace(sidebarCategoryStr, sidebarDropdownsStr);

// 7. Insert Dropdowns into Mobile Modal
const mobileCategoryStr = `            <div className="eyebrow" style={{ marginTop: '40px', marginBottom: '15px' }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <input type="radio" checked={category === t.val} onChange={() => updateFilters({ category: t.val, team: 'all' })} style={{ width: '20px', height: '20px', accentColor: 'var(--ink)' }} /> {t.label}
                </label>
              ))}
            </div>`;

const mobileDropdownsStr = `            <div className="eyebrow" style={{ marginTop: '40px', marginBottom: '15px' }}>Category</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {[{ label: 'All', val: 'all' }, { label: 'Club', val: 'club' }, { label: 'National', val: 'national' }].map(t => (
                <label key={t.val} style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <input type="radio" checked={category === t.val} onChange={() => updateFilters({ category: t.val, team: 'all' })} style={{ width: '20px', height: '20px', accentColor: 'var(--ink)' }} /> {t.label}
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <select value={category === 'club' ? team : 'all'} onChange={e => {
                  if (e.target.value === 'all') updateFilters({ team: 'all' });
                  else updateFilters({ category: 'club', team: e.target.value });
                }} style={{ width: '100%', padding: '15px', background: '#fff', color: 'var(--ink)', border: '1px solid #d9dcd3' }}>
                  <option value="all">Select Club Team...</option>
                  {clubTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <select value={category === 'national' ? team : 'all'} onChange={e => {
                  if (e.target.value === 'all') updateFilters({ team: 'all' });
                  else updateFilters({ category: 'national', team: e.target.value });
                }} style={{ width: '100%', padding: '15px', background: '#fff', color: 'var(--ink)', border: '1px solid #d9dcd3' }}>
                  <option value="all">Select National Team...</option>
                  {nationalTeams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>`;

c = c.replace(mobileCategoryStr, mobileDropdownsStr);

fs.writeFileSync('client/src/pages/Shop.jsx', c);
console.log('Added team dropdowns successfully.');
