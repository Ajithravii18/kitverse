const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const images = [
  {
    url: 'https://data2.nssmag.com/images/galleries/19700/By7ofhbCQAAKBra.jpg',
    filename: 'collar.jpg'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2vwebVnwLZrkzX_Z-HmM1s9iI2FZygi2PEdslpJgcxYDdvO7izVZIWHGw&s=10',
    filename: 'shorts.jpg'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH-_z93zl6DDmnXGLFnNj29YMG4xqyvxOd4dY-Zn0zEfbRi3vwBa6lOXg&s=10',
    filename: 'track-pants.jpg'
  },
  {
    url: 'https://fulltimestore.in/cdn/shop/collections/Screenshot_2023-07-05_at_21-50-38_Sports_Direct_Football_sportsdirectfootball_Instagram_photos_and_videos.png?v=1688574374',
    filename: 'clearance.jpg'
  }
];

const destDir = path.join(__dirname, 'client', 'public', 'images', 'categories');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
          if (res.statusCode === 301 || res.statusCode === 302) {
              return download(res.headers.location, dest).then(resolve).catch(reject);
          }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
    });
    req.on('error', reject);
  });
};

async function run() {
  for (const img of images) {
    try {
      console.log(`Downloading ${img.filename}...`);
      await download(img.url, path.join(destDir, img.filename));
      console.log(`Successfully downloaded ${img.filename}`);
    } catch (err) {
      console.error(`Error downloading ${img.filename}:`, err.message);
    }
  }
}

run();
