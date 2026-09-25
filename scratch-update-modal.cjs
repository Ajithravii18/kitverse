const fs = require('fs');
let c = fs.readFileSync('client/src/components/ProductDetailModal.jsx', 'utf-8');

// Remove thumb labels
c = c.replace(/<span className="thumb-label">\{image\.label\}<\/span>/g, '');

// Update size chips
const oldChip = `<span className="chip-name">{size}</span><span className="chip-status">{remaining(size) ? \`\${remaining(size)} available\` : 'Unavailable'}</span>`;
const newChip = `<span className="chip-name" style={{ textDecoration: remaining(size) === 0 ? 'line-through' : 'none' }}>{size} {remaining(size) === 0 && <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>&times;</span>}</span>
                {remaining(size) > 0 && remaining(size) < 5 && <span className="chip-status" style={{ color: '#d97706' }}>Low stock</span>}`;

c = c.replace(oldChip, newChip);

fs.writeFileSync('client/src/components/ProductDetailModal.jsx', c);
console.log('Detail modal updated.');
