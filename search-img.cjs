const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=site:pinterest.com+%22real+madrid%22+%22away+kit%22', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // try to find image urls
    const urls = data.match(/https:\/\/[^\s"'><]+\.(?:jpg|jpeg|png|webp)/ig) || [];
    console.log(urls.slice(0, 15).join('\n'));
  });
}).on('error', err => {
  console.error(err);
});
