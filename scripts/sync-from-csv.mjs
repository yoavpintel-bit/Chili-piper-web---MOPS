#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { readCsvFile } from './lib/csv-parse.mjs';
import { mergeRecords, normalizeCsvRow, isCatchAll } from './lib/normalize.mjs';
import {
  META_PATH,
  RECORDS_PATH,
  RAW_DIR,
} from './lib/paths.mjs';

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

function resolveInputPaths() {
  const env = process.env.CSV_PATHS;
  if (env) {
    return env.split(path.delimiter).map((p) => p.trim()).filter(Boolean);
  }
  const defaults = [
    path.join(process.env.HOME || '', 'Downloads/routing_log_export_1779801577558.csv'),
    path.join(process.env.HOME || '', 'Downloads/Concierge Logs Export.csv'),
    path.join(process.env.HOME || '', 'Downloads/routing_log_export_1779869041851.csv'),
  ];
  return defaults.filter((p) => fs.existsSync(p));
}

function main() {
  const files = resolveInputPaths();
  if (!files.length) {
    console.error('No CSV files found. Set CSV_PATHS or place exports in ~/Downloads.');
    process.exit(1);
  }

  const existing = readJsonl(RECORDS_PATH);
  let batch = [];

  for (const file of files) {
    console.log(`Reading ${file}`);
    const rows = readCsvFile(file);
    const normalized = rows.map(normalizeCsvRow);
    const catchRows = normalized.filter((r) => r.isCatchAll);
    console.log(`  ${rows.length} rows, ${catchRows.length} catch-all`);

    const snapshotName = `${path.basename(file, '.csv')}-${new Date().toISOString().slice(0, 10)}.json`;
    fs.writeFileSync(
      path.join(RAW_DIR, snapshotName),
      JSON.stringify({ source: file, importedAt: new Date().toISOString(), catchAll: catchRows }, null, 2)
    );

    batch = mergeRecords(batch, normalized);
  }

  const merged = mergeRecords(existing, batch);
  const catchAllOnly = merged.filter((r) => r.isCatchAll);
  writeJsonl(RECORDS_PATH, catchAllOnly);

  const meta = {
    lastSyncAt: new Date().toISOString(),
    source: 'csv',
    files,
    recordCount: catchAllOnly.length,
    totalRowsMerged: merged.length,
  };
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
  console.log(`Wrote ${catchAllOnly.length} catch-all records to ${RECORDS_PATH}`);
}

main();
