const fs = require('fs');
let content = fs.readFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/Storefront.jsx', 'utf8');

const contentHooks = `
 const [cms, setCms] = React.useState({
   'homepage-hero': {
     aboutLabel: "ABOUT US:",
     aboutText: "AT KITVERSE WE LIVE AND BREATHE FOOTBALL ARCHIVE CULTURE. WE ARE NOT MERELY ENTHUSIASTS; WE ARE STORYTELLERS OF KITVERSE LEGACY.",
     title: "MATCHDAY ARCHIVE",
     subtitle: "2024 / 2025 REVEAL SPECIFICATION",
     registry: "REGISTRY // FROM 2024",
     headline: "ENGINEERED FOR THE MODERN ICON",
     cta: "EXPLORE THE ARCHIVE"
   },
   'announcement-bar': {
     text: "FREE SHIPPING ON ORDERS OVER ₹1500 / USE CODE EXTRA10 FOR 10% OFF",
     isActive: true
   }
 });

 React.useEffect(() => {
   fetch('/api/content?keys=homepage-hero,announcement-bar')
     .then(r => r.json())
     .then(data => {
       if (data.content) {
         setCms(prev => ({ ...prev, ...data.content }));
       }
     })
     .catch(() => {}); // silently fallback to defaults
 }, []);
`;

content = content.replace("const [signedInNotice, setSignedInNotice] = React.useState('');", "const [signedInNotice, setSignedInNotice] = React.useState('');\n" + contentHooks);

// Now replace the hardcoded strings with cms variables.
content = content.replace(/ABOUT US:/g, "{cms['homepage-hero']?.aboutLabel}");
content = content.replace(/AT KITVERSE WE LIVE AND BREATHE FOOTBALL ARCHIVE CULTURE\. WE ARE NOT MERELY ENTHUSIASTS; WE ARE STORYTELLERS OF KITVERSE LEGACY\./g, "{cms['homepage-hero']?.aboutText}");
content = content.replace(/MATCHDAY ARCHIVE/g, "{cms['homepage-hero']?.title}");
content = content.replace(/2024 \/ 2025 REVEAL SPECIFICATION/g, "{cms['homepage-hero']?.subtitle}");
content = content.replace(/REGISTRY \/\/ FROM 2024/g, "{cms['homepage-hero']?.registry}");
content = content.replace(/>ENGINEERED FOR THE MODERN ICON</g, ">{cms['homepage-hero']?.headline}<");
content = content.replace(/>EXPLORE THE ARCHIVE</g, ">{cms['homepage-hero']?.cta}<");
content = content.replace(/FREE SHIPPING ON ORDERS OVER ₹1500 \/ USE CODE EXTRA10 FOR 10% OFF/g, "{cms['announcement-bar']?.text}");

// The Marquee is hardcoded? Let's check Marquee.
fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/scratch/patched_storefront.jsx', content);
fs.writeFileSync('C:/Users/AJITH/OneDrive/Documents/New project/client/src/pages/Storefront.jsx', content);
