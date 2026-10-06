import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
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

const CATEGORIES = [
  {
    key: 'jerseys',
    query: 'football jersey match kit soccer',
    filename: 'jerseys.jpg'
  },
  {
    key: 'embroidery',
    query: 'soccer jersey badge embroidery crest',
    filename: 'embroidery.jpg'
  },
  {
    key: 'combo',
    query: 'soccer kit jersey shorts football uniform',
    filename: 'combo.jpg'
  },
  {
    key: 'master-copy',
    query: 'soccer jersey details fabric kit player',
    filename: 'master-copy.jpg'
  },
  {
    key: 'player-version',
    query: 'soccer player match jersey kit elite',
    filename: 'player-version.jpg'
  },
  {
    key: 'retro',
    query: 'classic retro vintage football soccer shirt jersey',
    filename: 'retro.jpg'
  },
  {
    key: 'collar',
    query: 'polo shirt collar men streetwear fashion',
    filename: 'collar.jpg'
  },
  {
    key: 'shorts',
    query: 'athletic soccer football shorts gym sport',
    filename: 'shorts.jpg'
  },
  {
    key: 'track-pants',
    query: 'track pants tracksuit joggers athletic men sportswear',
    filename: 'track-pants.jpg'
  },
  {
    key: 'clearance',
    query: 'clothing rack retail apparel sale jerseys',
    filename: 'clearance.jpg'
  }
];

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  for (const cat of CATEGORIES) {
    console.log(`Searching for: ${cat.key} (${cat.query})...`);
    try {
      await page.goto(`https://unsplash.com/s/photos/${encodeURIComponent(cat.query)}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);
      
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.naturalWidth || img.width
          }))
          .filter(img => img.src && img.src.includes('images.unsplash.com/photo-') && img.alt && img.alt.length > 5);
      });

      console.log(`Found ${images.length} candidates for ${cat.key}`);
      if (images.length > 0) {
        // Pick best candidate
        const candidate = images[0];
        // Clean URL to high quality 1200px width
        let cleanUrl = candidate.src.split('?')[0] + '?auto=format&fit=crop&q=85&w=1200';
        console.log(`Downloading: ${candidate.alt.slice(0, 40)} -> ${cleanUrl}`);
        const dest = path.join(outDir, cat.filename);
        await download(cleanUrl, dest);
        console.log(`Saved ${cat.filename} (${fs.statSync(dest).size} bytes)`);
      }
    } catch (err) {
      console.error(`Error on ${cat.key}:`, err.message);
    }
  }

  await browser.close();
  console.log('Finished downloading category images!');
}

run();
