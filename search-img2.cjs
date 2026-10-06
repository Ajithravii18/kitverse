const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=site:reddit.com+%22real+madrid%22+%2226%2F27+away+kit%22', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https:\/\/[^\s"'><]+\.(?:jpg|jpeg|png|webp)/ig) || [];
    console.log(urls.slice(0, 10).join('\n'));
  });
}).on('error', err => {
  console.error(err);
});
