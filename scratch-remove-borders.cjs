const fs = require('fs');
const path = require('path');

const filesToProcess = [
  path.join(__dirname, 'client/src/pages/Storefront.jsx'),
  path.join(__dirname, 'client/src/pages/Shop.jsx')
];

filesToProcess.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // 1. Remove parallax stuff
  content = content.replace(/import useParallax from '\.\.\/useParallax\.js';\r?\n?/g, '');
  content = content.replace(/useParallax\(\);\r?\n?/g, '');
  content = content.replace(/data-speed="0\.1"/g, '');
  content = content.replace(/parallax /g, '');
  
  // 2. Remove horizontal lines
  content = content.replace(/<div className="absolute top-1 left-0 right-0 h-\[1px\] bg-black\/15 pointer-events-none"><\/div>/g, '');
  content = content.replace(/<div className="absolute bottom-1 left-0 right-0 h-\[1px\] bg-black\/15 pointer-events-none"><\/div>/g, '');
  content = content.replace(/<div className="absolute top-1 left-0 right-0 h-\[1px\] bg-black\/20 pointer-events-none"><\/div>/g, '');
  content = content.replace(/<div className="absolute bottom-1 left-0 right-0 h-\[1px\] bg-black\/20 pointer-events-none"><\/div>/g, '');
  
  // 3. Remove border classes
  const borderClasses = [
    'border-t-2', 'border-b-2', 'border-l-2', 'border-r-2',
    'border-t', 'border-b', 'border-l', 'border-r',
    'border-2', 'border',
    'border-black', 'border-black/10', 'border-black/15', 'border-black/20', 'border-black/40',
    'hover:border-black', 'hover:border-white'
  ];
  
  // We need to carefully replace these in classNames.
  // Instead of complex regex, let's just do text replacements for exact patterns we know are there,
  // or a general regex that replaces any of these words.
  
  borderClasses.forEach(cls => {
    // Replace class preceded by space or quote, followed by space or quote
    const regex = new RegExp(`(?<=[ "])(${cls})(?=[ "])`, 'g');
    content = content.replace(regex, '');
  });
  
  // Clean up double spaces in classNames
  content = content.replace(/ +"/g, '"');
  content = content.replace(/" +/g, '"');
  content = content.replace(/  +/g, ' ');

  fs.writeFileSync(file, content);
  console.log(`Processed ${file}`);
});
