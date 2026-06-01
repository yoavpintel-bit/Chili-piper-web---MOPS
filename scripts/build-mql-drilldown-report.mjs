#!/usr/bin/env node
/**
 * Build MQL drilldown report: SF cohort emails × Concierge routing exports.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readCsvFile } from './lib/csv-parse.mjs';
import { employeeMicroSegment, MICRO_SEGMENT_LABELS } from './lib/normalize.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DRILLDOWN_PATH =
  process.env.MQL_DRILLDOWN_PATH ||
  path.join(process.env.HOME || '', 'Downloads', 'drilldown - MQLs (4).csv');
const OUT_JSON = path.join(ROOT, 'data/mql_drilldown_report.json');
const OUT_CSV = path.join(ROOT, 'data/mql_drilldown_report.csv');
const OUT_EMAILS = path.join(ROOT, 'data/mql_drilldown_emails.txt');

function readDrilldownRows(filePath) {
  const text = fs.readFileSync(filePath, 'utf16le');
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].replace(/^\ufeff/, '').split('\t');
  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const email = (cols[idx.Email] || '').trim().toLowerCase();
    if (!email || !email.includes('@')) continue;
    rows.push({
      email,
      contactName: cols[idx['Contact Name']] || '',
      accountName: cols[idx['Account Name']] || '',
      owner: cols[idx['Contact Owner Name']] || '',
      mqls: cols[idx['MQLs (cohort)']] || '',
      mqas: cols[idx.MQAs] || '',
      qualification: cols[idx.Qualification] || '',
      meetingsCol: cols[idx.Meetings] || '',
      sfLink: cols[idx.Link] || '',
    });
  }
  return rows;
}

function pickEmployees(row) {
  const raw = row['Number of Employees'] ?? row['CB Company Employees'];
  if (raw === '' || raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function pickState(row) {
  const contact = row['CB Contact State'] ?? '';
  const company = row['CB company state'] ?? row['CB Company State'] ?? '';
  const v = String(contact || company || '').trim();
  return v && v !== 'null' ? v : '';
}

function logGeoFromRow(row) {
  const employees = pickEmployees(row);
  return {
    country: (row.Country || '').trim(),
    state: pickState(row),
    numberOfEmployees: employees,
    employeeMicroSegment: employeeMicroSegment(employees),
  };
}

function resolveInputFiles() {
  const env = process.env.MQL_CSV_PATHS;
  if (env) return env.split(path.delimiter).map((p) => p.trim()).filter(Boolean);
  const downloads = path.join(process.env.HOME || '', 'Downloads');
  const files = [
    ...fs.readdirSync(downloads).filter((f) => /^routing_log_export_\d+\.csv$/i.test(f)),
    ...fs
      .readdirSync(downloads)
      .filter((f) => /^Concierge Logs Export( \(\d+\))?\.csv$/i.test(f)),
  ].map((f) => path.join(downloads, f));
  return [...new Set(files)].filter((p) => fs.existsSync(p));
}

function main() {
  if (!fs.existsSync(DRILLDOWN_PATH)) {
    console.error('Drilldown not found:', DRILLDOWN_PATH);
    process.exit(1);
  }

  const cohort = readDrilldownRows(DRILLDOWN_PATH);
  const targets = new Set(cohort.map((r) => r.email));
  const cohortByEmail = new Map(cohort.map((r) => [r.email, r]));

  const byEmail = new Map();
  let totalRows = 0;

  for (const file of resolveInputFiles()) {
    const rows = readCsvFile(file);
    totalRows += rows.length;
    for (const row of rows) {
      const email = (row['Guest Email'] || row.Email || '').trim().toLowerCase();
      if (!targets.has(email)) continue;

      const entry = {
        file: path.basename(file),
        guestEmail: email,
        trigger: row.Trigger || '',
        source: row.Source || '',
        status: row.Status || '',
        assignedTo: row['Assigned To'] || '',
        assignmentMethod: row['Assignment Method'] || '',
        routingRuleMatched: row['Routing Rule Matched'] || '',
        crmRecord: row['CRM Record'] || '',
        date: row.Date || '',
        company: row.Company || '',
        ...logGeoFromRow(row),
      };

      if (!byEmail.has(email)) byEmail.set(email, []);
      byEmail.get(email).push(entry);
    }
  }

  const report = cohort.map((base) => {
    const logs = byEmail.get(base.email) || [];
    const sorted = [...logs].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const seen = new Set();
    const journey = [];
    for (const e of sorted) {
      const key = `${e.date}|${e.status}|${e.routingRuleMatched}|${e.source}`;
      if (seen.has(key)) continue;
      seen.add(key);
      journey.push({
        date: e.date,
        status: e.status,
        rule: e.routingRuleMatched,
        assignedTo: e.assignedTo,
        source: e.source,
      });
    }

    const latest = sorted[0] || null;
    const geo = latest
      ? {
          country: latest.country || '',
          state: latest.state || '',
          numberOfEmployees: latest.numberOfEmployees,
          employeeMicroSegment: latest.employeeMicroSegment || 'missing',
        }
      : {
          country: '',
          state: '',
          numberOfEmployees: null,
          employeeMicroSegment: 'missing',
        };

    return {
      email: base.email,
      ...base,
      ...geo,
      inConciergeLogs: journey.length > 0,
      logCount: journey.length,
      latestStatus: latest?.status || null,
      latestRule: latest?.routingRuleMatched || null,
      latestAssignedTo: latest?.assignedTo || null,
      latestTrigger: latest?.trigger || null,
      latestDate: latest?.date || null,
      latestSource: latest?.source || null,
      journey,
    };
  });

  const statusBreakdown = {};
  const ruleBreakdown = {};
  const countryBreakdown = {};
  const stateBreakdown = {};
  const eeBreakdown = {};

  for (const r of report) {
    const st = r.inConciergeLogs ? r.latestStatus || 'Unknown' : 'No Concierge log in exports';
    statusBreakdown[st] = (statusBreakdown[st] || 0) + 1;
    if (r.latestRule) ruleBreakdown[r.latestRule] = (ruleBreakdown[r.latestRule] || 0) + 1;
    const country = r.country || '(empty)';
    countryBreakdown[country] = (countryBreakdown[country] || 0) + 1;
    const stateKey = r.state || '(empty)';
    stateBreakdown[stateKey] = (stateBreakdown[stateKey] || 0) + 1;
    const seg = r.employeeMicroSegment || 'missing';
    eeBreakdown[seg] = (eeBreakdown[seg] || 0) + 1;
  }

  const summary = {
    targetEmails: targets.size,
    filesScanned: resolveInputFiles().length,
    totalRowsScanned: totalRows,
    foundInConciergeExports: report.filter((r) => r.inConciergeLogs).length,
    notFound: report.filter((r) => !r.inConciergeLogs).length,
    statusBreakdown,
    ruleBreakdown,
    countryBreakdown,
    stateBreakdown,
    employeeSegmentBreakdown: eeBreakdown,
    builtAt: new Date().toISOString(),
  };

  const payload = { summary, report };
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const esc = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const headers = [
    'Email',
    'Contact Name',
    'Account',
    'SF Owner',
    'Country',
    'State',
    'Employees',
    'EE Segment',
    'SF qual.',
    'SF mtg',
    'In Concierge',
    'Log Events',
    'Latest Date',
    'Latest Status',
    'Latest Rule',
    'Latest Assignee',
    'Latest Source',
  ];
  const csvLines = [headers.join(',')];
  for (const r of report) {
    csvLines.push(
      [
        r.email,
        r.contactName,
        r.accountName,
        r.owner,
        r.country,
        r.state,
        r.numberOfEmployees ?? '',
        MICRO_SEGMENT_LABELS[r.employeeMicroSegment] || r.employeeMicroSegment,
        r.qualification === '1' ? 'Yes' : 'No',
        r.meetingsCol === '1' ? 'Yes' : 'No',
        r.inConciergeLogs,
        r.logCount,
        r.latestDate,
        r.latestStatus,
        r.latestRule,
        r.latestAssignedTo,
        r.latestSource,
      ]
        .map(esc)
        .join(',')
    );
  }
  fs.writeFileSync(OUT_CSV, csvLines.join('\n') + '\n');
  fs.writeFileSync(OUT_EMAILS, [...targets].sort().join('\n') + '\n');

  console.log(JSON.stringify(summary, null, 2));
  console.log('Wrote', OUT_JSON, OUT_CSV);
}

main();
