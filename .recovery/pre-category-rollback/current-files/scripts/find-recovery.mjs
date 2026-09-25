import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
const lines = execFileSync('git', ['cat-file', '--batch-all-objects', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], { encoding: 'utf8' }).trim().split(/\r?\n/);
for (const line of lines) {
  const [sha, kind, sizeText] = line.split(' ');
  const size = Number(sizeText);
  if (kind !== 'blob' || size <= 2000 || size >= 150000) continue;
  const blob = execFileSync('git', ['cat-file', 'blob', sha]);
  if (!blob.includes('className="hero-stage"') && !blob.includes('className="collections-circles"')) continue;
  const content = blob.toString('utf8');
  let mtime = 0;
  try { mtime = statSync(`.git/objects/${sha.slice(0, 2)}/${sha.slice(2)}`).mtime.toISOString(); } catch {}
  const count = needle => content.split(needle).length - 1;
  console.log(`${sha} bytes=${size} mtime=${mtime} hero-stage=${count('hero-stage')} collections-circles=${count('collections-circles')} shop-by-team=${count('shop-by-team')} bestsellers=${count('bestsellers')}`);
}
