const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

const regex = /<div className=\{`home-page transition-opacity duration-500 \$\{cmsLoaded \? "opacity-100" : "opacity-0"\}`\} ref=\{homeRef\}>/;

code = code.replace(regex, '<div className="home-page" ref={homeRef}>');

fs.writeFileSync('client/src/pages/Storefront.jsx', code);
