#!/usr/bin/env node
/**
 * Import Concierge logs JSON saved from MCP concierge-logs calls.
 * Usage: node scripts/sync-from-mcp-file.mjs path/to/logs.json [path2 ...]
 * Each file: array of log entries OR { logs: [...] }
 */
import fs from 'fs';
import path from 'path';
import { META_PATH, RAW_DIR, RECORDS_PATH } from './lib/paths.mjs';
import { mergeRecords, normalizeApiLog } from './lib/normalize.mjs';

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(filePath, records) {
  const body = records.map((r) => JSON.stringify(r)).join('\n') + (records.length ? '\n' : '');
  fs.writeFileSync(filePath, body, 'utf8');
}

function loadLogs(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (Array.isArray(raw)) return raw;
  return raw.logs ?? raw.entries ?? raw.records ?? [];
}

function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error('Usage: sync-from-mcp-file.mjs <logs.json> [...]');
    process.exit(1);
  }

  const existing = readJsonl(RECORDS_PATH);
  let batch = [];

  for (const file of files) {
    const logs = loadLogs(file);
    const normalized = logs.map(normalizeApiLog).filter((r) => r.isCatchAll);
    console.log(`${file}: ${logs.length} logs, ${normalized.length} catch-all`);

    fs.copyFileSync(
      file,
      path.join(RAW_DIR, `mcp-${path.basename(file)}`)
    );
    batch = mergeRecords(batch, normalized);
  }

  const merged = mergeRecords(existing, batch);
  const catchAll = merged.filter((r) => r.isCatchAll);
  writeJsonl(RECORDS_PATH, catchAll);

  const meta = JSON.parse(
    fs.existsSync(META_PATH) ? fs.readFileSync(META_PATH, 'utf8') : '{}'
  );
  meta.lastSyncAt = new Date().toISOString();
  meta.source = 'mcp-file';
  meta.recordCount = catchAll.length;
  meta.mcpFiles = files;
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
  console.log(`Total catch-all records: ${catchAll.length}`);
}

main();
