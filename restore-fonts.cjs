const fs = require('fs');
let html = fs.readFileSync('client/index.html', 'utf8');

const fontLinks = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
`;

// Insert right before the tailwind CDN script or </head>
html = html.replace('</head>', fontLinks + '</head>');
fs.writeFileSync('client/index.html', html);
console.log("Restored fonts!");
