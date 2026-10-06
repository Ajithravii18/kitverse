const https = require('https');

https.get('https://www.footyheadlines.com/search/label/Real%20Madrid', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https:\/\/[^\s"'><]+\.(?:jpg|jpeg|png|webp)/ig) || [];
    // filter for images containing real-madrid or away
    const filtered = urls.filter(u => u.includes('real-madrid') || u.includes('away') || u.includes('kit'));
    console.log(Array.from(new Set(filtered)).slice(0, 5).join('\n'));
  });
}).on('error', err => {
  console.error(err);
});
