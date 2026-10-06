import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

https.get('https://www.adidas.co.in/spain-home-jersey-1994/JN3707.html', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const matches = data.match(/https:\/\/assets\.adidas\.com\/images\/[^"'\s]+/g);
    console.log('Matches:', matches ? [...new Set(matches)].slice(0, 5) : 'None');
  });
});
