const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/Storefront.jsx', 'utf8');

const announcementHtml = `
 {cms['announcement-bar']?.isActive && (
   <div className="bg-black text-white text-xs font-bold text-center py-2 tracking-widest uppercase">
     {cms['announcement-bar']?.text}
   </div>
 )}
`;

// Insert right after <div className="home-page" ref={homeRef}>
content = content.replace('<div className="home-page" ref={homeRef}>', '<div className="home-page" ref={homeRef}>\n' + announcementHtml);

fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/Storefront.jsx', content);
