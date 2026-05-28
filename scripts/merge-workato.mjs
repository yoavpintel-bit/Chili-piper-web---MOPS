#!/usr/bin/env node
/**
 * Merge Workato Catch-All output into records.jsonl.
 *
 * Configure via environment:
 *   WORKATO_CSV_PATH  — path to Workato daily export (same schema as Concierge CSV)
 *   WORKATO_JSON_PATH — optional JSON array export
 *
 * When Workato destination is defined (Google Sheet, SF, etc.), add an adapter
 * here or export to CSV and set WORKATO_CSV_PATH.
 */
import fs from 'fs';
import { readCsvFile } from './lib/csv-parse.mjs';
import { mergeRecords, normalizeCsvRow } from './lib/normalize.mjs';
import { META_PATH, RECORDS_PATH } from './lib/paths.mjs';

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

function main() {
  const csvPath = process.env.WORKATO_CSV_PATH;
  const jsonPath = process.env.WORKATO_JSON_PATH;

  if (!csvPath && !jsonPath) {
    console.log(
      'Workato merge skipped: set WORKATO_CSV_PATH or WORKATO_JSON_PATH when Workato export is available.'
    );
    process.exit(0);
  }

  const existing = readJsonl(RECORDS_PATH);
  let incoming = [];

  if (csvPath && fs.existsSync(csvPath)) {
    incoming = readCsvFile(csvPath)
      .map(normalizeCsvRow)
      .filter((r) => r.isCatchAll);
    console.log(`Workato CSV: ${incoming.length} catch-all rows`);
  }

  if (jsonPath && fs.existsSync(jsonPath)) {
    const rows = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const fromJson = (Array.isArray(rows) ? rows : rows.records || [])
      .map((row) =>
        row.routingRuleMatched
          ? { ...row, isCatchAll: /^catch\s*all$/i.test(row.routingRuleMatched) }
          : normalizeCsvRow(row)
      )
      .filter((r) => r.isCatchAll);
    incoming = mergeRecords(incoming, fromJson);
  }

  const merged = mergeRecords(existing, incoming);
  const catchAll = merged.filter((r) => r.isCatchAll);
  writeJsonl(RECORDS_PATH, catchAll);

  const meta = JSON.parse(
    fs.existsSync(META_PATH) ? fs.readFileSync(META_PATH, 'utf8') : '{}'
  );
  meta.workatoMergedAt = new Date().toISOString();
  meta.workatoRecordCount = incoming.length;
  meta.recordCount = catchAll.length;
  meta.workatoNote =
    'Cross-check layer for recent days; primary history from API/CSV sync.';
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
  console.log(`After Workato merge: ${catchAll.length} catch-all records`);
}

main();
