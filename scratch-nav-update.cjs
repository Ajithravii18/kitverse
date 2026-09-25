const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf-8');

// Desktop nav
content = content.replace(
  /<nav className="desktop-nav".*?\{collections\.map.*?<\/nav>/,
  match => match.replace('</nav>', '<Link to="/shop">Shop All</Link></nav>')
);

// Mobile menu
content = content.replace(
  /<nav className="menu-links".*?\{collections\.map.*?<\/nav>/,
  match => match.replace('</nav>', '<Link to="/shop" onClick={()=>setMenu(false)}>Shop All<span>↗</span></Link></nav>')
);

fs.writeFileSync('client/src/pages/Storefront.jsx', content);
console.log('Nav updated');
