const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const images = [
  {
    url: 'https://www.saradasports.com/cdn/shop/files/3_bcdc1046-ec0a-4257-b574-c1138adcb01d.png?v=1780142867&width=3840',
    filename: 'combo.png'
  },
  {
    url: 'https://elitejersey.in/wp-content/uploads/2025/08/img_6142-scaled-1.jpeg',
    filename: 'master-copy.jpeg'
  },
  {
    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiDPU-LKoacNWEuAOIAJsSh65uLoMKPz2_yd8wGWZyAwv7_74TDQY7lLSp&s=10',
    filename: 'retro.jpg'
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
