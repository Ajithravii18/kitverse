const fs = require('fs');

let code = fs.readFileSync('client/src/pages/Storefront.jsx', 'utf8');

// Add cmsLoaded state
code = code.replace(
  /const \[cms, setCms\] = React\.useState\(\{/,
  "const [cmsLoaded, setCmsLoaded] = React.useState(false);\n const [cms, setCms] = React.useState({"
);

// Update fetch to set cmsLoaded
const oldFetch = ` React.useEffect(() => {
   fetch('/api/content?keys=homepage-hero,announcement-bar')
     .then(r => r.json())
     .then(data => {
       if (data.content) {
         setCms(prev => ({ ...prev, ...data.content }));
       }
     })
     .catch(() => {}); // silently fallback to defaults
 }, []);`;

const newFetch = ` React.useEffect(() => {
   fetch('/api/content?keys=homepage-hero,announcement-bar')
     .then(r => r.json())
     .then(data => {
       if (data.content) {
         setCms(prev => ({ ...prev, ...data.content }));
       }
     })
     .catch(() => {})
     .finally(() => setCmsLoaded(true));
 }, []);`;

code = code.replace(oldFetch, newFetch);

// Update render to include opacity transition
code = code.replace(
  /<div className="home-page" ref=\{homeRef\}>/,
  '<div className={`home-page transition-opacity duration-500 ${cmsLoaded ? "opacity-100" : "opacity-0"}`} ref={homeRef}>'
);

fs.writeFileSync('client/src/pages/Storefront.jsx', code);
