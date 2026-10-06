import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'client', 'public', 'images', 'categories');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

const CATEGORIES = [
  {
    key: 'jerseys',
    query: 'football jersey match kit wallpaper hd',
    filename: 'jerseys.jpg'
  },
  {
    key: 'embroidery',
    query: 'football club badge embroidery macro close up',
    filename: 'embroidery.jpg'
  },
  {
    key: 'combo',
    query: 'football kit jersey and shorts set',
    filename: 'combo.jpg'
  },
  {
    key: 'master-copy',
    query: 'player issue football shirt heat sealed badge detail',
    filename: 'master-copy.jpg'
  },
  {
    key: 'player-version',
    query: 'authentic player version soccer jersey fabric mesh',
    filename: 'player-version.jpg'
  },
  {
    key: 'retro',
    query: 'vintage retro classic football jersey 90s',
    filename: 'retro.jpg'
  },
  {
    key: 'collar',
    query: 'football club polo collar shirt casual',
    filename: 'collar.jpg'
  },
  {
    key: 'shorts',
    query: 'football training match shorts authentic',
    filename: 'shorts.jpg'
  },
  {
    key: 'track-pants',
    query: 'football training track pants slim fit',
    filename: 'track-pants.jpg'
  },
  {
    key: 'clearance',
    query: 'football shirts rack store sale',
    filename: 'clearance.jpg'
  }
];

async function run() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  for (const cat of CATEGORIES) {
    console.log(`\nSearching Google Images for: ${cat.query}...`);
    try {
      await page.goto(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(cat.query)}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Extract image links or preview images
      const imgUrls = await page.evaluate(() => {
        // Collect imgs that have src and good dimensions
        const list = [];
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          if (img.src && (img.src.startsWith('http') || img.src.startsWith('data:image/jpeg;base64'))) {
            const w = img.naturalWidth || img.width;
            const h = img.naturalHeight || img.height;
            if (w > 120 && h > 120) {
              list.push(img.src);
            }
          }
        }
        return list;
      });

      console.log(`Found ${imgUrls.length} candidate images for ${cat.key}`);
      if (imgUrls.length > 0) {
        // Find first valid http image or base64
        let saved = false;
        for (const src of imgUrls) {
          if (src.startsWith('http') && !src.includes('googlelogo') && !src.includes('gstatic.com/images?q=tbn:ANd9GcT')) {
            try {
              const dest = path.join(outDir, cat.filename);
              await download(src, dest);
              if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
                console.log(`Successfully saved ${cat.filename} from ${src.slice(0, 60)} (${fs.statSync(dest).size} bytes)`);
                saved = true;
                break;
              }
            } catch (e) {
              // try next
            }
          }
        }
      }
    } catch (e) {
      console.error(`Error on ${cat.key}:`, e.message);
    }
  }

  await browser.close();
}

run();
