#!/usr/bin/env node
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function run(script, env = {}) {
  const r = spawnSync('node', [path.join(__dirname, script)], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const mode = process.argv[2] || 'auto';

if (mode === 'csv') {
  run('sync-from-csv.mjs');
} else if (mode === 'api') {
  run('sync-from-api.mjs');
} else if (process.env.CHILI_PIPER_API_KEY || process.env.CHILI_PIPER_TOKEN) {
  run('sync-from-api.mjs');
} else {
  run('sync-from-csv.mjs');
}

run('build-aggregates.mjs');
run('publish-data.mjs');
