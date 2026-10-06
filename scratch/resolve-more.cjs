const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories');

function getDownloadUrl(photoId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'unsplash.com',
      path: `/photos/${photoId}/download`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(options, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        reject(new Error(`Failed with status ${res.statusCode} for ${photoId}`));
      }
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', reject);
  });
}

const list = [
  { id: 'IsbhA3WX-aK', name: 'collar.jpg' },
  { id: 'mY35jWjJ7z8', name: 'shorts.jpg' },
  { id: 'V9y-iK-Kj9o', name: 'combo.jpg' }
];

async function main() {
  for (const item of list) {
    try {
      console.log(`Resolving ${item.id}...`);
      const directUrl = await getDownloadUrl(item.id);
      const optimizedUrl = directUrl.split('?')[0] + '?auto=format&fit=crop&q=85&w=1200';
      const dest = path.join(outDir, item.name);
      console.log(`Downloading ${item.name} from ${optimizedUrl.slice(0, 60)}...`);
      await downloadFile(optimizedUrl, dest);
      console.log(`Saved ${item.name} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Error for ${item.id}:`, e.message);
    }
  }
}

main();
