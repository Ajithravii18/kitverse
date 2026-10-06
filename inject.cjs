const fs = require('fs');
let content = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf-8');
const injection = `
  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location.hash]);
`;
content = content.replace(
  '  React.useEffect(() => {\n    if (!signedInNotice) return undefined;',
  injection + '\n  React.useEffect(() => {\n    if (!signedInNotice) return undefined;'
);
fs.writeFileSync('client/src/pages/Storefront.jsx', content);
