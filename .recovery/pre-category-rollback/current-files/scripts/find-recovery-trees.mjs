import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
const target = process.argv[2];
if (!target) throw new Error('Pass a blob SHA');
const lines = execFileSync('git', ['cat-file', '--batch-all-objects', '--batch-check=%(objectname) %(objecttype) %(objectsize)'], { encoding: 'utf8' }).trim().split(/\r?\n/);
const trees = new Map();
const parents = new Map();
for (const line of lines) {
  const [sha, kind] = line.split(' ');
  if (kind !== 'tree') continue;
  const entries = execFileSync('git', ['cat-file', '-p', sha], { encoding: 'utf8' }).trim().split(/\r?\n/).map(row => {
    const m = row.match(/^\d+ (blob|tree) ([0-9a-f]{40})\t(.+)$/);
    return m ? { type: m[1], sha: m[2], name: m[3] } : null;
  }).filter(Boolean);
  trees.set(sha, entries);
  for (const entry of entries) {
    if (!parents.has(entry.sha)) parents.set(entry.sha, []);
    parents.get(entry.sha).push({ sha, name: entry.name });
  }
}
function walk(sha, suffix='') {
  for (const parent of parents.get(sha) || []) {
    const path = parent.name + suffix;
    if (path === 'client/src/pages/Storefront.jsx') {
      let mtime = '';
      try { mtime = statSync(`.git/objects/${parent.sha.slice(0,2)}/${parent.sha.slice(2)}`).mtime.toISOString(); } catch {}
      console.log(`TREE ${parent.sha} ${mtime} ${path}`);
      console.log(trees.get(parent.sha).map(x => x.name).join(', '));
    }
    walk(parent.sha, '/' + path);
  }
}
walk(target);
