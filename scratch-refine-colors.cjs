const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Shop.jsx', 'utf-8');

// Fix Pagination
c = c.replace(/background:currentPage===1\?'#ddd':'var\(--ink\)',color:currentPage===1\?'#888':'var\(--paper\)'/g, "background:currentPage===1?'#ddd':'var(--lime)',color:currentPage===1?'#888':'inherit'");
c = c.replace(/background:currentPage===totalPages\?'#ddd':'var\(--ink\)',color:currentPage===totalPages\?'#888':'var\(--paper\)'/g, "background:currentPage===totalPages?'#ddd':'var(--lime)',color:currentPage===totalPages?'#888':'inherit'");

// Fix Mobile Modal Apply button
c = c.replace(/background: 'var\(--ink\)', color: 'var\(--paper\)'/g, "background: 'var(--lime)', color: 'inherit'");

fs.writeFileSync('client/src/pages/Shop.jsx', c);
console.log('Colors refined');
