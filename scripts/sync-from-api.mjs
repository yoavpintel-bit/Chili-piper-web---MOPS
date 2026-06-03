#!/usr/bin/env node
/**
 * Incremental sync from Chili Piper Concierge logs (Fire Edge API).
 * Requires: CHILI_PIPER_API_KEY (or CHILI_PIPER_TOKEN), optional CHILI_PIPER_API_BASE
 */
import fs from 'fs';
import path from 'path';
import {
  CONFIG_PATH,
  META_PATH,
  RAW_DIR,
  RECORDS_PATH,
} from './lib/paths.mjs';
import { mergeRecords, normalizeApiLog } from './lib/normalize.mjs';

const API_BASE =
  process.env.CHILI_PIPER_API_BASE || 'https://fire.chilipiper.com';
const LOGS_PATH =
  process.env.CHILI_PIPER_LOGS_PATH ||
  '/api/fire-edge/v1/org/concierge/logs';

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

async function fetchLogs(workspaceId, routerId, start, end, apiKey) {
  const url = new URL(LOGS_PATH, API_BASE);
  url.searchParams.set('workspaceId', workspaceId);
  url.searchParams.set('routerId', routerId);
  url.searchParams.set('start', start);
  url.searchParams.set('end', end);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Concierge logs API ${res.status}: ${text.slice(0, 500)}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data.logs ?? data.entries ?? [];
}

function* monthWindows(daysBack) {
  const end = new Date();
  const startLimit = new Date(end);
  startLimit.setDate(startLimit.getDate() - daysBack);

  let windowEnd = new Date(end);
  while (windowEnd > startLimit) {
    const windowStart = new Date(windowEnd);
    windowStart.setDate(windowStart.getDate() - 29);
    if (windowStart < startLimit) windowStart.setTime(startLimit.getTime());
    yield {
      start: windowStart.toISOString(),
      end: windowEnd.toISOString(),
    };
    windowEnd = new Date(windowStart);
    windowEnd.setMilliseconds(windowEnd.getMilliseconds() - 1);
  }
}

/** One-day chunks — large multi-day responses can 502 on Fire Edge. */
function* dayWindows(daysBack) {
  const end = new Date();
  const startLimit = new Date(end);
  startLimit.setDate(startLimit.getDate() - daysBack);
  let cursor = new Date(startLimit);
  while (cursor < end) {
    const windowStart = new Date(cursor);
    const windowEnd = new Date(cursor);
    windowEnd.setDate(windowEnd.getDate() + 1);
    if (windowEnd > end) windowEnd.setTime(end.getTime());
    yield {
      start: windowStart.toISOString(),
      end: windowEnd.toISOString(),
    };
    cursor = windowEnd;
  }
}

async function main() {
  const apiKey = process.env.CHILI_PIPER_API_KEY || process.env.CHILI_PIPER_TOKEN;
  if (!apiKey) {
    console.error('Set CHILI_PIPER_API_KEY or CHILI_PIPER_TOKEN');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const { workspaceId, routerId } = config;

  const daysBack = Number(process.env.SYNC_DAYS_BACK || 180);
  const fullBackfill = process.env.SYNC_FULL_BACKFILL === '1';
  const incrementalDays = Number(process.env.SYNC_INCREMENTAL_DAYS || 2);

  const windows = fullBackfill
    ? [...monthWindows(daysBack)]
    : [...dayWindows(incrementalDays)];

  const existing = readJsonl(RECORDS_PATH);
  let batch = [];

  for (const { start, end } of windows) {
    console.log(`Fetching ${start} → ${end}`);
    try {
      const logs = await fetchLogs(workspaceId, routerId, start, end, apiKey);
      const normalized = logs.map(normalizeApiLog).filter((r) => r.isCatchAll);
      console.log(`  ${logs.length} logs, ${normalized.length} catch-all`);

      const snap = `api-${start.slice(0, 10)}_${end.slice(0, 10)}.json`;
      fs.writeFileSync(
        path.join(RAW_DIR, snap),
        JSON.stringify({ start, end, count: normalized.length, records: normalized }, null, 2)
      );

      batch = mergeRecords(batch, normalized);
    } catch (err) {
      console.warn(`  Window failed: ${err.message}`);
    }
  }

  const merged = mergeRecords(existing, batch);
  const catchAll = merged.filter((r) => r.isCatchAll);
  writeJsonl(RECORDS_PATH, catchAll);

  const meta = {
    lastSyncAt: new Date().toISOString(),
    source: 'api',
    workspaceId,
    routerId,
    recordCount: catchAll.length,
    windows: windows.length,
  };
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
  console.log(`Wrote ${catchAll.length} catch-all records`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
