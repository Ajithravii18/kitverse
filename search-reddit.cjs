const https = require('https');

https.get('https://www.reddit.com/r/realmadrid/search.json?q=away+kit&restrict_sr=on&sort=relevance&t=all', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const posts = json.data.children;
      for (const post of posts) {
        if (post.data.url && post.data.url.match(/\.(jpg|jpeg|png)$/)) {
          console.log(post.data.url);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', err => {
  console.error(err);
});
