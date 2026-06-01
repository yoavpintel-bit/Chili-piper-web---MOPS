#!/usr/bin/env node
/** Copy data artifacts into public/ for GitHub Pages static fetch */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  AGGREGATES_PATH,
  DATA_DIR,
  META_PATH,
  RECORDS_PATH,
} from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DATA = path.resolve(__dirname, '../public/data/catch_all');
const PUBLIC_ROUTER_TEAMS = path.resolve(__dirname, '../public/data/router_teams');
const PUBLIC_MQL_DRILLDOWN = path.resolve(__dirname, '../public/data/mql_drilldown');
const ROUTER_TEAMS_PATH = path.resolve(__dirname, '../data/router_teams/inbound-router-live.json');
const MQL_REPORT_JSON = path.resolve(__dirname, '../data/mql_drilldown_report.json');
const MQL_REPORT_CSV = path.resolve(__dirname, '../data/mql_drilldown_report.csv');

function copyIfExists(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

fs.mkdirSync(PUBLIC_DATA, { recursive: true });
copyIfExists(AGGREGATES_PATH, path.join(PUBLIC_DATA, 'aggregates.json'));
copyIfExists(RECORDS_PATH, path.join(PUBLIC_DATA, 'records.jsonl'));
copyIfExists(META_PATH, path.join(PUBLIC_DATA, 'meta.json'));
copyIfExists(
  path.join(DATA_DIR, 'config.json'),
  path.join(PUBLIC_DATA, 'config.json')
);
copyIfExists(
  ROUTER_TEAMS_PATH,
  path.join(PUBLIC_ROUTER_TEAMS, 'inbound-router-live.json')
);
console.log(`Published data to ${PUBLIC_DATA}`);
if (fs.existsSync(path.join(PUBLIC_ROUTER_TEAMS, 'inbound-router-live.json'))) {
  console.log(`Published router teams to ${PUBLIC_ROUTER_TEAMS}`);
}
fs.mkdirSync(PUBLIC_MQL_DRILLDOWN, { recursive: true });
copyIfExists(MQL_REPORT_JSON, path.join(PUBLIC_MQL_DRILLDOWN, 'report.json'));
copyIfExists(MQL_REPORT_CSV, path.join(PUBLIC_MQL_DRILLDOWN, 'report.csv'));
if (fs.existsSync(path.join(PUBLIC_MQL_DRILLDOWN, 'report.json'))) {
  console.log(`Published MQL drilldown to ${PUBLIC_MQL_DRILLDOWN}`);
}
