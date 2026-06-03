#!/usr/bin/env node
/**
 * Build Teams & Countries dataset from Chili Piper router / rules / teams MCP exports.
 * Output: data/router_teams/inbound-router-live.json (+ copy to public/data/)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WORKSPACE_ID = '5ffdc2c64c46df00017023a8';
const ROUTER_ID = '7e9c794d-b6db-40ec-ae07-f363d77b5f36';

const DEFAULT_CACHE = {
  teams:
    '/Users/yoav.pintel/.cursor/projects/Users-yoav-pintel-Documents-Cursor-Chili-piper/agent-tools/960715c3-14c0-4d23-b5f8-5641f7dd5544.txt',
  rules:
    '/Users/yoav.pintel/.cursor/projects/Users-yoav-pintel-Documents-Cursor-Chili-piper/agent-tools/485e3e86-3ab9-4afb-9719-d33454314f70.txt',
  router:
    '/Users/yoav.pintel/.cursor/projects/Users-yoav-pintel-Documents-Cursor-Chili-piper/agent-tools/aeda74bf-bb4e-4a7e-963e-05857a485191.txt',
};

const RAW_DIR = path.join(ROOT, 'data/router_teams/raw');
const OUT_DIR = path.join(ROOT, 'data/router_teams');
const OUT_FILE = path.join(OUT_DIR, 'inbound-router-live.json');
const PUBLIC_OUT = path.join(ROOT, 'public/data/router_teams/inbound-router-live.json');

const SIZE_SEGMENTS = [
  { id: 'under_20', label: 'Under 20', min: 0, max: 19 },
  { id: '20_49', label: '20 – 49', min: 20, max: 49 },
  { id: '50_99', label: '50 – 99', min: 50, max: 99 },
  { id: '100_199', label: '100 – 199', min: 100, max: 199 },
  { id: '200_499', label: '200 – 499', min: 200, max: 499 },
  { id: '500_8000', label: '500 – 8,000', min: 500, max: 8000 },
  { id: 'over_8000', label: 'Over 8,000', min: 8001, max: Infinity },
];

function resolveInputPath(envKey, rawName, cacheDefault) {
  if (process.env[envKey]) return process.env[envKey];
  const rawPath = path.join(RAW_DIR, rawName);
  if (fs.existsSync(rawPath)) return rawPath;
  if (fs.existsSync(cacheDefault)) return cacheDefault;
  return rawPath;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing input: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sourceLabel(filePath) {
  const rel = path.relative(ROOT, filePath);
  if (rel && !rel.startsWith('..')) return rel;
  return path.basename(filePath);
}

function normalizeRuleName(name) {
  return String(name || '')
    .replace(/\s*\((evaluating|updated|AAEs)\)\s*/gi, '')
    .trim()
    .toLowerCase();
}

function displaySegmentLabel(ruleName) {
  return String(ruleName || '')
    .replace(/\s*\((evaluating|updated|AAEs|RAD)\)\s*/gi, '')
    .replace(/\s*-\s*RAD\s*$/i, '')
    .trim();
}

function resolveTeam(rule, teams) {
  const segmentKey = normalizeRuleName(displaySegmentLabel(rule.name));

  if (rule.teamId) {
    const byId = teams.find((t) => t.id === rule.teamId || t.teamId === rule.teamId);
    if (byId) return byId;
  }

  // Column I teams in Chili Piper match segment label exactly (spreadsheet row)
  const exact = teams.find((t) => normalizeRuleName(t.name) === segmentKey);
  if (exact) return exact;

  const key = normalizeRuleName(rule.name);
  const exactRaw = teams.find((t) => t.name.toLowerCase().trim() === rule.name.toLowerCase().trim());
  if (exactRaw) return exactRaw;

  const stripped = teams.filter((t) => {
    const tn = normalizeRuleName(t.name);
    return tn === key || tn.startsWith(`${key} `) || key.startsWith(`${tn} `);
  });
  if (stripped.length === 1) return stripped[0];

  let best = null;
  let bestScore = 0;
  for (const t of teams) {
    const tn = normalizeRuleName(t.name);
    if (tn === key) return t;
    if (tn.includes(key) || key.includes(tn)) {
      const score = Math.min(tn.length, key.length);
      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    }
  }
  return best;
}

function walkConditions(node, visit) {
  if (!node || typeof node !== 'object') return;
  visit(node);
  if (Array.isArray(node.conditions)) {
    for (const child of node.conditions) walkConditions(child, visit);
  }
}

function extractCountries(conditions) {
  const countries = new Set();
  walkConditions(conditions, (node) => {
    if (node.type !== 'StaticValueCondition') return;
    const field = node.dataReference?.field || '';
    const isPersonCountry =
      field === 'PersonCountry' ||
      (node.dataReference?.object === 'Person' && /country/i.test(field));
    if (!isPersonCountry) return;
    const values = Array.isArray(node.value) ? node.value : [node.value];
    for (const v of values) {
      if (v != null && String(v).trim()) countries.add(String(v).trim());
    }
  });
  return [...countries].sort((a, b) => a.localeCompare(b));
}

const EMPLOYEE_FIELDS = new Set([
  'NumberOfEmployees',
  'CB_Company_Employees_New__c',
  'cb_company_employees__c',
  '818b9e36-3115-4aea-b53b-5ee463f14abf',
  '5fc0bf49-0e0a-4c5a-9f3a-8e8d5e5d5e5e',
]);

const SKIP_GEO_VALUES = new Set(['Americas', 'EMEA', 'APAC', 'rad', 'wad', 'pricing', 'demo']);

function extractStates(conditions) {
  const states = new Set();
  walkConditions(conditions, (node) => {
    if (node.type !== 'StaticValueCondition') return;
    const field = String(node.dataReference?.field || '');
    if (EMPLOYEE_FIELDS.has(field) || /employee/i.test(field)) return;
    if (field === 'Region_PB__c' || /region/i.test(field)) return;
    if (field === 'PersonCountry' || /country/i.test(field)) return;

    const isStateField = field === 'BillingState' || /state/i.test(field);
    const values = Array.isArray(node.value) ? node.value : node.value != null ? [node.value] : [];
    if (!values.length) return;

    if (!isStateField) {
      if (node.operator !== 'containsAnyOf' || values.length < 2) return;
      if (!values.every((v) => typeof v === 'string' && v.length > 2)) return;
      if (values.some((v) => SKIP_GEO_VALUES.has(v))) return;
    }

    for (const v of values) {
      const s = String(v).trim();
      if (!s || SKIP_GEO_VALUES.has(s)) continue;
      states.add(s);
    }
  });
  return [...states].sort((a, b) => a.localeCompare(b));
}

function extractEmployeeRangeFromConditions(conditions) {
  let min = null;
  let max = null;
  walkConditions(conditions, (node) => {
    if (node.type !== 'StaticValueCondition') return;
    const field = node.dataReference?.field || '';
    if (!EMPLOYEE_FIELDS.has(field) && !/employee/i.test(field)) return;
    const val = Number(node.value);
    if (!Number.isFinite(val)) return;
    if (node.operator === '>' || node.operator === '>=') {
      const bound = node.operator === '>' ? val + 1 : val;
      min = min == null ? bound : Math.max(min, bound);
    }
    if (node.operator === '<' || node.operator === '<=') {
      const bound = node.operator === '<' ? val - 1 : val;
      max = max == null ? bound : Math.min(max, bound);
    }
    if (node.operator === 'between' && Array.isArray(node.value)) {
      const [lo, hi] = node.value.map(Number);
      if (Number.isFinite(lo)) min = min == null ? lo : Math.max(min, lo);
      if (Number.isFinite(hi)) max = max == null ? hi : Math.min(max, hi);
    }
  });
  if (min == null && max == null) return null;
  return { min: min ?? 0, max: max ?? Infinity };
}

function parseEmployeeRangeFromName(name) {
  const m = String(name).match(/:\s*([\d,]+)\s*[-–]\s*([\d,]+)/);
  if (!m) return null;
  return {
    min: parseInt(m[1].replace(/,/g, ''), 10),
    max: parseInt(m[2].replace(/,/g, ''), 10),
  };
}

function mergeRanges(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    min: Math.max(a.min, b.min),
    max: Math.min(a.max, b.max),
  };
}

function rangeLabel(range) {
  if (!range) return null;
  const maxLabel = range.max === Infinity ? '∞' : String(range.max);
  return `${range.min} – ${maxLabel}`;
}

function segmentIdsForRange(range) {
  if (!range) return [];
  return SIZE_SEGMENTS.filter((seg) => {
    const lo = Math.max(range.min, seg.min);
    const hi = Math.min(range.max, seg.max);
    return lo <= hi;
  }).map((s) => s.id);
}

function rangesOverlap(a, b) {
  if (!a || !b) return true;
  return Math.max(a.min, b.min) <= Math.min(a.max, b.max);
}

function loadUserMap() {
  const usersPath =
    process.env.ROUTER_TEAMS_USERS_FILE || path.join(RAW_DIR, 'users-cache.json');
  if (!fs.existsSync(usersPath)) return new Map();
  const raw = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
  const arr = Array.isArray(raw) ? raw : raw.results || [];
  return new Map(
    arr.map((u) => [
      String(u.id),
      { name: u.name || null, email: u.email || null },
    ])
  );
}

function mapMembers(memberIds, userMap) {
  return (memberIds || []).map((id) => {
    const uid = String(id);
    const u = userMap.get(uid);
    return { id: uid, name: u?.name || null, email: u?.email || null };
  }).filter((m) => m.name || m.email);
}

function columnIMembersText(members) {
  const names = (members || []).map((m) => m.name).filter(Boolean);
  return names.length ? names.join(', ') : null;
}

function main() {
  const teamsPath = resolveInputPath('ROUTER_TEAMS_TEAMS_FILE', 'teams.json', DEFAULT_CACHE.teams);
  const rulesPath = resolveInputPath('ROUTER_TEAMS_RULES_FILE', 'rules.json', DEFAULT_CACHE.rules);
  const routerPath = resolveInputPath('ROUTER_TEAMS_ROUTER_FILE', 'router.json', DEFAULT_CACHE.router);

  const teamsPayload = readJson(teamsPath);
  const rulesPayload = readJson(rulesPath);
  const routerPayload = readJson(routerPath);

  const teams = teamsPayload.results || [];
  const rules = rulesPayload.results || [];
  const userMap = loadUserMap();
  const ruleMap = new Map(rules.map((r) => [r.id, r]));

  const routerEntry = (routerPayload.routers || []).find(
    (r) => r.router?.id === ROUTER_ID || r.id === ROUTER_ID
  );
  if (!routerEntry?.router) {
    throw new Error(`Router ${ROUTER_ID} not found in router export`);
  }
  const router = routerEntry.router;
  const routingRules = router.routing?.rules || [];

  const entries = [];
  const onRouterIds = new Set();
  const regionPrefixes = new Set();
  let order = 0;
  for (const route of routingRules) {
    if (route.type !== 'RuleRoute' || !route.id) continue;
    const rule = ruleMap.get(route.id);
    if (!rule) continue;
    order += 1;

    const fromName = parseEmployeeRangeFromName(rule.name);
    const fromConds = extractEmployeeRangeFromConditions(rule.conditions);
    const employeeRange = mergeRanges(fromName, fromConds) || fromName || fromConds;
    const segmentLabel = displaySegmentLabel(rule.name);
    const team = resolveTeam(rule, teams);
    const countries = extractCountries(rule.conditions);
    const states = extractStates(rule.conditions);
    const nameLower = rule.name.toLowerCase();
    const members = team ? mapMembers(team.members, userMap) : [];
    const teamNameExact = team && normalizeRuleName(team.name) === normalizeRuleName(segmentLabel);

    onRouterIds.add(rule.id);
    const regionPrefix = segmentLabel.split('|')[0]?.trim();
    if (regionPrefix) regionPrefixes.add(regionPrefix);

    entries.push({
      id: rule.id,
      name: rule.name,
      segmentLabel,
      order,
      product: rule.product || null,
      ruleType: rule.type || null,
      countries,
      states,
      employeeRange: employeeRange
        ? {
            min: employeeRange.min,
            max: employeeRange.max === Infinity ? null : employeeRange.max,
            label: rangeLabel(employeeRange),
          }
        : null,
      sizeSegmentIds: segmentIdsForRange(employeeRange),
      team: team
        ? {
            id: team.id || team.teamId,
            name: segmentLabel,
            chiliPiperTeamName: team.name,
            nameMatchesSegment: teamNameExact,
            memberCount: members.length,
            members,
            columnI: columnIMembersText(members),
          }
        : null,
      flags: {
        evaluating: nameLower.includes('(evaluating)'),
        updated: nameLower.includes('(updated)'),
        ownership: rule.type === 'OwnershipRule' || nameLower === 'ownership',
        rad: /\bRAD\b/i.test(rule.name) || /-\s*RAD\s*$/i.test(rule.name),
        onRouter: true,
      },
    });
  }

  const onRouterSegmentKeys = new Set(
    entries.map((e) => normalizeRuleName(e.segmentLabel))
  );

  // Rules + teams in Chili Piper for an active region, not yet on the router flow
  for (const rule of rules) {
    if (onRouterIds.has(rule.id)) continue;
    const segmentLabel = displaySegmentLabel(rule.name);
    if (onRouterSegmentKeys.has(normalizeRuleName(segmentLabel))) continue;
    const regionPrefix = segmentLabel.split('|')[0]?.trim();
    if (!regionPrefix || !regionPrefixes.has(regionPrefix)) continue;
    if (!segmentLabel.includes('|')) continue;

    const team = resolveTeam(rule, teams);
    if (!team) continue;
    if (normalizeRuleName(team.name) !== normalizeRuleName(segmentLabel)) continue;

    order += 1;
    const fromName = parseEmployeeRangeFromName(rule.name);
    const fromConds = extractEmployeeRangeFromConditions(rule.conditions);
    const employeeRange = mergeRanges(fromName, fromConds) || fromName || fromConds;
    const countries = extractCountries(rule.conditions);
    const states = extractStates(rule.conditions);
    const nameLower = rule.name.toLowerCase();
    const members = mapMembers(team.members, userMap);
    const teamNameExact = normalizeRuleName(team.name) === normalizeRuleName(segmentLabel);

    entries.push({
      id: rule.id,
      name: rule.name,
      segmentLabel,
      order,
      product: rule.product || null,
      ruleType: rule.type || null,
      countries,
      states,
      employeeRange: employeeRange
        ? {
            min: employeeRange.min,
            max: employeeRange.max === Infinity ? null : employeeRange.max,
            label: rangeLabel(employeeRange),
          }
        : null,
      sizeSegmentIds: segmentIdsForRange(employeeRange),
      team: {
        id: team.id || team.teamId,
        name: segmentLabel,
        chiliPiperTeamName: team.name,
        nameMatchesSegment: teamNameExact,
        memberCount: members.length,
        members,
        columnI: columnIMembersText(members),
      },
      flags: {
        evaluating: nameLower.includes('(evaluating)'),
        updated: nameLower.includes('(updated)'),
        ownership: rule.type === 'OwnershipRule' || nameLower === 'ownership',
        rad: /\bRAD\b/i.test(rule.name) || /-\s*RAD\s*$/i.test(rule.name),
        onRouter: false,
      },
    });
  }

  const countrySet = new Set();
  const stateSet = new Set();
  for (const e of entries) {
    for (const c of e.countries) countrySet.add(c);
    for (const s of e.states) stateSet.add(s);
  }

  const payload = {
    meta: {
      builtAt: new Date().toISOString(),
      workspaceId: WORKSPACE_ID,
      routerId: ROUTER_ID,
      routerName: router.name,
      routerSlug: router.slug,
      ruleCount: entries.length,
      teamCount: teams.length,
      sources: {
        teams: sourceLabel(teamsPath),
        rules: sourceLabel(rulesPath),
        router: sourceLabel(routerPath),
        users: fs.existsSync(path.join(RAW_DIR, 'users-cache.json')) ? 'data/router_teams/raw/users-cache.json' : null,
      },
    },
    filters: {
      countries: [...countrySet].sort((a, b) => a.localeCompare(b)),
      states: [...stateSet].sort((a, b) => a.localeCompare(b)),
      sizeSegments: SIZE_SEGMENTS.map(({ id, label, min, max }) => ({
        id,
        label,
        min,
        max: max === Infinity ? null : max,
      })),
    },
    rules: entries,
    _helpers: {
      segmentIdsForRange,
      rangesOverlap,
    },
  };

  delete payload._helpers;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);
  fs.mkdirSync(path.dirname(PUBLIC_OUT), { recursive: true });
  fs.copyFileSync(OUT_FILE, PUBLIC_OUT);

  const withTeam = entries.filter((e) => e.team).length;
  const withCountry = entries.filter((e) => e.countries.length).length;
  const withStates = entries.filter((e) => e.states.length).length;
  console.log(`Wrote ${entries.length} rules (${withTeam} with team, ${withCountry} with countries, ${withStates} with states)`);
  console.log(`  → ${OUT_FILE}`);
  console.log(`  → ${PUBLIC_OUT}`);
}

main();
