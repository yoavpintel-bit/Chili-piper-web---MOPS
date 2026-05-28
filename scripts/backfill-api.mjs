#!/usr/bin/env node
/** Run 6-month backfill using windows in data/catch_all/backfill-windows.json */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { DATA_DIR } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const windowsPath = path.join(DATA_DIR, 'backfill-windows.json');

process.env.SYNC_FULL_BACKFILL = '1';
process.env.SYNC_DAYS_BACK = '180';

const r = spawnSync('node', [path.join(__dirname, 'sync-from-api.mjs')], {
  stdio: 'inherit',
  env: process.env,
});

if (r.status !== 0) {
  console.error('API backfill failed. Use CSV or MCP file import instead.');
  process.exit(r.status ?? 1);
}

spawnSync('node', [path.join(__dirname, 'build-aggregates.mjs')], { stdio: 'inherit' });
spawnSync('node', [path.join(__dirname, 'publish-data.mjs')], { stdio: 'inherit' });
