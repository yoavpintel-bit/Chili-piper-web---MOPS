import crypto from 'crypto';

const CATCH_ALL_RE = /^catch\s*all$/i;

export function isCatchAll(routingRuleMatched) {
  return CATCH_ALL_RE.test(String(routingRuleMatched || '').trim());
}

function pickEmployees(row) {
  const n = row.numberOfEmployees ?? row.cbCompanyEmployees;
  if (n === '' || n == null) return null;
  const num = Number(n);
  return Number.isFinite(num) ? num : null;
}

export function employeeBand(employees) {
  if (employees == null || employees === '') return 'missing';
  const n = Number(employees);
  if (!Number.isFinite(n)) return 'missing';
  if (n < 20) return 'under_20';
  if (n > 8000) return 'over_8000';
  return 'in_range';
}

/** Finer segments for MOPS / routing gap analysis */
export function employeeMicroSegment(employees) {
  if (employees == null || employees === '') return 'missing';
  const n = Number(employees);
  if (!Number.isFinite(n)) return 'missing';
  if (n < 20) return 'under_20';
  if (n < 50) return '20_49';
  if (n < 100) return '50_99';
  if (n < 200) return '100_199';
  if (n < 500) return '200_499';
  if (n <= 8000) return '500_8000';
  return 'over_8000';
}

export const MICRO_SEGMENT_LABELS = {
  under_20: 'Under 20',
  '20_49': '20 – 49',
  '50_99': '50 – 99',
  '100_199': '100 – 199',
  '200_499': '200 – 499',
  '500_8000': '500 – 8,000',
  over_8000: 'Over 8,000',
  missing: 'Missing',
};

function pickState(row) {
  const contact = row['CB Contact State'] ?? row.contactState ?? '';
  const company = row['CB company state'] ?? row['CB Company State'] ?? row.companyState ?? '';
  const v = String(contact || company || '').trim();
  return v && v !== 'null' ? v : '';
}

export function isUnitedStates(country) {
  const c = String(country || '').trim().toLowerCase();
  return c === 'united states' || c === 'us' || c === 'usa' || c === 'united states of america';
}

export function dedupeKey(record) {
  if (record.id) return `id:${record.id}`;
  const email = (record.guestEmail || record.email || '').toLowerCase();
  const ts = record.triggeredAt || '';
  return crypto.createHash('sha256').update(`${email}|${ts}`).digest('hex').slice(0, 32);
}

/** Normalize a row from Concierge CSV export */
export function normalizeCsvRow(row) {
  const routingRuleMatched =
    row['Routing Rule Matched'] ?? row.routingRuleMatched ?? '';
  const triggeredAt = row.Date ?? row.triggeredAt ?? '';
  const guestEmail = row['Guest Email'] ?? row.Email ?? row.guestEmail ?? '';
  const record = {
    id: row.id ?? null,
    guestEmail,
    email: row.Email ?? guestEmail,
    firstName: row['First Name'] ?? row.firstName ?? '',
    lastName: row['Last Name'] ?? row.lastName ?? '',
    company: row.Company ?? row.company ?? '',
    trigger: row.Trigger ?? row.trigger ?? '',
    source: row.Source ?? row.source ?? '',
    status: row.Status ?? row.status ?? '',
    routingRuleMatched: String(routingRuleMatched).trim(),
    assignedTo: row['Assigned To'] ?? row.assignedTo ?? '',
    assignmentMethod: row['Assignment Method'] ?? row.assignmentMethod ?? '',
    crmRecord: row['CRM Record'] ?? row.crmRecord ?? '',
    triggeredAt,
    spamCheckScore: row['Spam Check Score'] ?? row.spamCheckScore ?? null,
    country: row.Country ?? row.country ?? '',
    numberOfEmployees: pickEmployees({
      numberOfEmployees: row['Number of Employees'],
      cbCompanyEmployees: row['CB Company Employees'],
    }),
    cbCompanyEmployees: row['CB Company Employees'] ?? null,
    formPage: row['Website - Form Submitted'] ?? row.formPage ?? '',
    contactState: pickState(row),
    companyState: String(row['CB company state'] ?? row.companyState ?? '').trim() || '',
    isCatchAll: isCatchAll(routingRuleMatched),
    sourceType: 'csv',
  };
  record.state = record.contactState || record.companyState || '';
  record.employeeBand = employeeBand(record.numberOfEmployees);
  record.employeeMicroSegment = employeeMicroSegment(record.numberOfEmployees);
  record.dedupeKey = dedupeKey(record);
  return record;
}

/** Normalize a log entry from Chili Piper API / MCP */
export function normalizeApiLog(entry) {
  const routing = entry.routing || {};
  const matchedPath = entry.matchedPath ?? routing.matchedPath ?? routing.ruleName ?? '';
  const routingRuleMatched =
    typeof matchedPath === 'string'
      ? matchedPath
      : matchedPath?.name ?? matchedPath?.label ?? JSON.stringify(matchedPath);

  const record = {
    id: entry.id ?? null,
    guestEmail: entry.guestEmail ?? '',
    email: entry.guestEmail ?? '',
    firstName: '',
    lastName: '',
    company: '',
    trigger: entry.trigger ?? '',
    source: entry.sourceUrl ?? entry.source ?? '',
    status: entry.status ?? '',
    routingRuleMatched: String(routingRuleMatched).trim(),
    assignedTo: (entry.assignments || []).map((a) => a.name || a.email).filter(Boolean).join(', '),
    assignmentMethod: entry.assignments?.[0]?.method ?? '',
    crmRecord: entry.crmUrl ?? '',
    triggeredAt: entry.triggeredAt ?? '',
    spamCheckScore: null,
    country: '',
    numberOfEmployees: null,
    cbCompanyEmployees: null,
    formPage: '',
    contactState: '',
    companyState: '',
    state: '',
    isCatchAll: isCatchAll(routingRuleMatched),
    sourceType: 'api',
  };
  record.employeeBand = employeeBand(record.numberOfEmployees);
  record.employeeMicroSegment = employeeMicroSegment(record.numberOfEmployees);
  record.dedupeKey = dedupeKey(record);
  return record;
}

function preferRicher(prev, next) {
  const merged = { ...prev, ...next };
  for (const key of ['state', 'contactState', 'companyState', 'formPage', 'country']) {
    if (!merged[key] && (prev[key] || next[key])) {
      merged[key] = next[key] || prev[key];
    }
  }
  if (!merged.employeeMicroSegment) {
    merged.employeeMicroSegment =
      next.employeeMicroSegment || prev.employeeMicroSegment || employeeMicroSegment(merged.numberOfEmployees);
  }
  return merged;
}

export function mergeRecords(existing, incoming) {
  const map = new Map();
  for (const r of existing) {
    map.set(r.dedupeKey, r);
  }
  for (const r of incoming) {
    const prev = map.get(r.dedupeKey);
    map.set(r.dedupeKey, prev ? preferRicher(prev, r) : r);
  }
  return [...map.values()].sort(
    (a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt)
  );
}
