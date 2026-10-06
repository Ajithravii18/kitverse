const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function getOgImage(photoSlug) {
  return new Promise((resolve) => {
    https.get('https://unsplash.com/photos/' + photoSlug, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const match = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);
        resolve(match ? match[1] : null);
      });
    }).on('error', e => {
      console.error(e);
      resolve(null);
    });
  });
}

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  console.log('Testing test fetch...');
  const url = await getOgImage('YofQmnc-wns');
  console.log('Got URL:', url);
  if (url) {
    const dest = path.join(outDir, 'test-badge.jpg');
    await downloadFile(url, dest);
    console.log('Saved to', dest, 'Size:', fs.statSync(dest).size);
  }
})();
