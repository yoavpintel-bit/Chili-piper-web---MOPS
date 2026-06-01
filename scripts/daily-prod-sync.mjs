#!/usr/bin/env node
/**
 * Daily production sync — run from GitHub Actions at 09:00 Israel time.
 *
 * 1. Concierge Catch-All logs (Chili Piper API)
 * 2. Optional Workato merge (WORKATO_CSV_PATH / WORKATO_JSON_PATH)
 * 3. Router teams dataset (from data/router_teams/raw/)
 * 4. Aggregates, publish to public/, sync Pages root
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function run(script, env = {}, optional = false) {
  const label = script.replace(/\.mjs$/, '');
  console.log(`\n▶ ${label}`);
  const r = spawnSync('node', [path.join(__dirname, script)], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (r.status !== 0) {
    if (optional) {
      console.warn(`⚠ ${label} skipped (${r.status})`);
      return false;
    }
    process.exit(r.status ?? 1);
  }
  return true;
}

const hasApiKey = Boolean(process.env.CHILI_PIPER_API_KEY || process.env.CHILI_PIPER_TOKEN);

console.log('Daily prod sync started', new Date().toISOString());
console.log(`  API key: ${hasApiKey ? 'yes' : 'no'}`);
console.log(`  Workato: ${process.env.WORKATO_CSV_PATH || process.env.WORKATO_JSON_PATH ? 'configured' : 'not set'}`);

if (hasApiKey) {
  run('sync-from-api.mjs', {
    SYNC_INCREMENTAL_DAYS: process.env.SYNC_INCREMENTAL_DAYS || '7',
    SYNC_FULL_BACKFILL: process.env.SYNC_FULL_BACKFILL || '0',
  });
} else {
  console.warn('⚠ No CHILI_PIPER_API_KEY — Concierge logs unchanged (add secret in GitHub)');
  run('sync-from-csv.mjs', {}, true);
}

run('merge-workato.mjs', {}, true);
run('build-router-teams.mjs', {}, true);
run('build-aggregates.mjs');
run('publish-data.mjs');
run('sync-pages-root.mjs');

console.log('\n✓ Daily prod sync finished', new Date().toISOString());
