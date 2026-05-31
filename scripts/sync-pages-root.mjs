#!/usr/bin/env node
/** Copy public/ site to repo root for GitHub Pages "Deploy from branch /root". */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');

function cpDir(src, dest) {
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
}

function mergeDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) mergeDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

cpDir(path.join(pub, 'js'), path.join(root, 'js'));
mergeDir(path.join(pub, 'data'), path.join(root, 'data'));
fs.copyFileSync(path.join(pub, 'index.html'), path.join(root, 'index.html'));
fs.writeFileSync(path.join(root, '.nojekyll'), '\n');
console.log('Synced public/ → repo root (index.html, js/, data/, .nojekyll)');
