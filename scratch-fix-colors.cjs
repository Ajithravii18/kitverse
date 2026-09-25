const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Shop.jsx', 'utf-8');

// Replace shop-layout background
c = c.replace(/background: 'var\(--bg\)', color: 'var\(--text\)'/, "background: 'var(--paper)', color: 'var(--ink)'");

// Sidebar replacements
c = c.replace(/borderRight: '1px solid var\(--border\)'/g, "borderRight: '1px solid #d9dcd3'");
c = c.replace(/color: '#888'/g, "color: 'var(--muted)'");

// Map filters text color
c = c.replace(/color: type === t\.val \? 'var\(--lime\)' : 'var\(--text\)'/g, "color: type === t.val ? 'var(--ink)' : 'var(--muted)'");
c = c.replace(/color: category === t\.val \? 'var\(--lime\)' : 'var\(--text\)'/g, "color: category === t.val ? 'var(--ink)' : 'var(--muted)'");
c = c.replace(/color: retro \? 'var\(--lime\)' : 'var\(--text\)'/g, "color: retro ? 'var(--ink)' : 'var(--muted)'");

// Select inputs in sidebar
c = c.replace(/background: '#000', color: '#fff', border: '1px solid #333'/g, "background: '#fff', color: 'var(--ink)', border: '1px solid #d9dcd3'");

// Clear filters button
c = c.replace(/border: '1px solid #333', color: '#888'/g, "border: '1px solid #d9dcd3', color: 'var(--muted)'");
c = c.replace(/border: '1px solid #333', textTransform: 'uppercase'/g, "border: '1px solid #d9dcd3', color: 'var(--ink)', textTransform: 'uppercase'");

// Shop header row border
c = c.replace(/borderBottom: '1px solid var\(--border\)'/g, "borderBottom: '1px solid #d9dcd3'");

// Desktop sort select
c = c.replace(/background: 'transparent', color: 'var\(--text\)', border: '1px solid #333'/g, "background: '#fff', color: 'var(--ink)', border: '1px solid #d9dcd3'");

// Empty state border
c = c.replace(/border: '1px dashed #333'/g, "border: '1px dashed #d9dcd3'");

// Pagination buttons
c = c.replace(/background:currentPage===1\?'#333':'var\(--lime\)',color:currentPage===1\?'#888':'#000'/g, "background:currentPage===1?'#ddd':'var(--ink)',color:currentPage===1?'#888':'var(--paper)'");
c = c.replace(/background:currentPage===totalPages\?'#333':'var\(--lime\)',color:currentPage===totalPages\?'#888':'#000'/g, "background:currentPage===totalPages?'#ddd':'var(--ink)',color:currentPage===totalPages?'#888':'var(--paper)'");

// Mobile filter modal overrides
c = c.replace(/background: '#111', color: '#fff', border: '1px solid #333'/g, "background: '#fff', color: 'var(--ink)', border: '1px solid #d9dcd3'");
c = c.replace(/color: retro \? 'var\(--lime\)' : '#fff'/g, "color: retro ? 'var(--ink)' : 'var(--muted)'");
c = c.replace(/background: 'var\(--lime\)', color: '#000'/g, "background: 'var(--ink)', color: 'var(--paper)'");
c = c.replace(/background: 'transparent', color: '#fff'/g, "background: 'transparent', color: 'var(--ink)'");

// Accent colors
c = c.replace(/accentColor: 'var\(--lime\)'/g, "accentColor: 'var(--ink)'");

fs.writeFileSync('client/src/pages/Shop.jsx', c);
console.log('Shop.jsx colors updated.');
