/* global React */
const { useState, useEffect, useMemo } = React;

const DATA_URL = 'data/router_teams/inbound-router-live.json?v=20260603a';
const SPREADSHEET_URL =
  'https://docs.google.com/spreadsheets/d/1sUUDp7n0uwrYDKZZMmBwVNe2-8sQEwzEKMWW47IgYFk/edit?gid=837037962#gid=837037962';

const REGIONS = [
  { id: 'ca', label: 'Canada', emoji: '🇨🇦', match: (n) => /^Canada\s*\|/i.test(n), grid: 'col-start-1 row-start-1' },
  { id: 'us', label: 'United States', emoji: '🇺🇸', match: (n) => /^US\s*\|/i.test(n), grid: 'col-start-1 row-start-2' },
  { id: 'latam', label: 'LATAM', emoji: '🌎', match: (n) => /^LATAM\s*\|/i.test(n), grid: 'col-start-1 row-start-3' },
  { id: 'uki', label: 'UKI & ROW', emoji: '🇬🇧', match: (n) => /^UKI\s*&\s*ROW/i.test(n), grid: 'col-start-2 row-start-1' },
  { id: 'neb', label: 'NEB / Iberia', emoji: '🇪🇺', match: (n) => /^(Nordics|Benelux|Western Europe|EuroWest|Iberia)\s*\|/i.test(n), grid: 'col-start-2 row-start-2' },
  { id: 'dach', label: 'DACH', emoji: '🇩🇪', match: (n) => /^DACH\s*\|/i.test(n), grid: 'col-start-3 row-start-2' },
  { id: 'ilcee', label: 'IL & CEE', emoji: '🌍', match: (n) => /^IL\s*&\s*CEE/i.test(n), grid: 'col-start-3 row-start-3' },
  { id: 'apj', label: 'APJ', emoji: '🌏', match: (n) => /^APJ\s*\|/i.test(n), grid: 'col-start-4 row-start-2 row-span-2' },
];

function segmentLabel(rule) {
  return rule.segmentLabel || String(rule.name || '')
    .replace(/\s*\((evaluating|updated|AAEs)\)\s*/gi, '')
    .trim();
}

function isRadRule(rule) {
  return Boolean(rule.flags?.rad) || /\bRAD\b/i.test(rule.name || '') || /-\s*RAD\s*$/i.test(rule.name || '');
}

function parseRangeFromName(name) {
  const m = String(name).match(/:\s*([\d,]+)\s*[-–]\s*([\d,]+)/);
  if (!m) return null;
  return parseInt(m[1].replace(/,/g, ''), 10);
}

function sortRules(rules) {
  return [...rules].sort((a, b) => {
    const ra = parseRangeFromName(a.name) ?? 99999;
    const rb = parseRangeFromName(b.name) ?? 99999;
    if (ra !== rb) return ra - rb;
    return segmentLabel(a).localeCompare(segmentLabel(b));
  });
}

function getRegionForRule(rule) {
  return REGIONS.find((r) => r.match(rule.name || '')) || null;
}

function memberNames(rule) {
  const fromColumn = rule.team?.columnI;
  if (fromColumn) return fromColumn.split(',').map((s) => s.trim()).filter(Boolean);
  return (rule.team?.members || []).map((m) => m.name).filter(Boolean);
}

function RegionTile({ region, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border-2 transition-all min-h-[88px] flex flex-col justify-between ${
        active
          ? 'border-[#E2004F] bg-[#FFF0F3] shadow-md ring-2 ring-[#E2004F]/20'
          : 'border-[#EBE5D9] bg-white hover:border-[#E2004F]/50 hover:shadow-sm'
      }`}
    >
      <span className="text-2xl leading-none">{region.emoji}</span>
      <div>
        <span className={`text-sm font-extrabold block leading-tight ${active ? 'text-[#E2004F]' : 'text-[#222121]'}`}>
          {region.label}
        </span>
        <span className="text-[11px] text-slate-400 mt-0.5 block">
          {count} segment{count !== 1 ? 's' : ''}
        </span>
      </div>
    </button>
  );
}

function SegmentRow({ rule, open, onToggle, pinned, onPin, regionId }) {
  const label = segmentLabel(rule);
  const rad = isRadRule(rule);
  const names = memberNames(rule);
  const geoLabel = regionId === 'us' ? 'States' : 'Countries';
  const geoValues = regionId === 'us'
    ? (rule.states?.length ? rule.states : rule.countries)
    : rule.countries;

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all ${open ? 'border-[#E2004F] bg-white shadow-md' : 'border-[#EBE5D9] bg-white'}`}>
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 text-left px-4 py-4 min-w-0"
        >
          <div className="flex flex-wrap items-center gap-2 pr-2">
            <p className="text-sm font-extrabold text-[#222121] leading-snug">{label}</p>
            {rad && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                RAD
              </span>
            )}
            {rule.flags?.onRouter === false && (
              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Not on router yet
              </span>
            )}
          </div>
          {names.length > 0 && !open && (
            <p className="text-xs text-slate-500 mt-1 truncate">{names.join(' · ')}</p>
          )}
          {rule.employeeRange?.label && (
            <p className="text-[11px] text-slate-400 mt-1">Employees {rule.employeeRange.label}</p>
          )}
          {!open && geoValues?.length > 0 && (
            <p className="text-[11px] text-slate-400 mt-1 truncate">
              {geoValues.length} {geoLabel.toLowerCase()}
            </p>
          )}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPin(); }}
          title={pinned ? 'Unpin from compare' : 'Keep open while browsing others'}
          className={`shrink-0 px-3 border-l border-[#EBE5D9] text-[10px] font-bold ${
            pinned ? 'bg-[#E2004F] text-white' : 'text-slate-400 hover:bg-[#FAF8F5]'
          }`}
        >
          {pinned ? 'Pinned' : 'Pin'}
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="shrink-0 px-4 text-slate-400 font-bold text-lg border-l border-[#EBE5D9] hover:bg-[#FAF8F5]"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '−' : '+'}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-[#F0EAE1] bg-[#FAF8F5]/40 animate-fadeIn">
          <div className="pt-4">
            <p className="text-[10px] font-extrabold uppercase text-[#E2004F] tracking-wider mb-2">Team members</p>
            {names.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {names.map((name) => (
                  <span
                    key={name}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#FFF0F3] border border-[#FFD2DB] text-[#222121]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rose-600">No members listed</p>
            )}
          </div>
          {geoValues?.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2">
                {geoLabel} ({geoValues.length})
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {geoValues.join(' · ')}
              </p>
            </div>
          )}
          {regionId === 'us' && !geoValues?.length && (
            <p className="mt-4 text-xs text-slate-400 italic">No state list in router conditions</p>
          )}
        </div>
      )}
    </div>
  );
}

function TeamsCountriesPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [openIds, setOpenIds] = useState([]);
  const [pinnedIds, setPinnedIds] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const embedded = window.__PORTAL_DATA__ && window.__PORTAL_DATA__.routerTeams;
    if (embedded) {
      setData(embedded);
      setLoading(false);
      return undefined;
    }
    (async () => {
      try {
        const res = await fetch(DATA_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('Could not load router teams');
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const routableRules = useMemo(() => {
    if (!data?.rules) return [];
    return data.rules.filter((r) => {
      const n = (r.name || '').toLowerCase();
      if (r.flags?.ownership || n === 'ownership') return false;
      if (/customer\/churn|notrelevant|spam|test domain/i.test(n)) return false;
      return getRegionForRule(r) != null;
    });
  }, [data]);

  const regionCounts = useMemo(() => {
    const m = {};
    REGIONS.forEach((r) => { m[r.id] = 0; });
    routableRules.forEach((rule) => {
      const reg = getRegionForRule(rule);
      if (reg) m[reg.id] += 1;
    });
    return m;
  }, [routableRules]);

  const regionRules = useMemo(() => {
    if (!regionId) return [];
    const region = REGIONS.find((r) => r.id === regionId);
    if (!region) return [];
    return sortRules(routableRules.filter((r) => region.match(r.name)));
  }, [routableRules, regionId]);

  const pickRegion = (id) => {
    setRegionId(id);
    setOpenIds([]);
    setPinnedIds([]);
  };

  const toggleOpen = (id) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (!prev.includes(id)) {
        setOpenIds((o) => (o.includes(id) ? o : [...o, id]));
      }
      return next;
    });
  };

  const activeRegion = REGIONS.find((r) => r.id === regionId);
  const meta = data?.meta || {};

  if (loading) {
    return <div className="text-center py-16 text-sm text-slate-500 animate-pulse">Loading…</div>;
  }
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-sm text-rose-900">
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn text-left max-w-4xl mx-auto">
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-extrabold text-[#222121]">Teams &amp; Countries</h3>
        <p className="text-sm text-slate-500 mt-1">
          Pick a region → tap a segment → see reps &amp; countries. Tap <strong>Pin</strong> to keep several open.
        </p>
        <a
          href={SPREADSHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-xs font-bold text-[#E2004F] hover:underline"
        >
          Open spreadsheet ↗
        </a>
      </div>

      {/* Region picker tiles */}
      <div className="bg-white border border-[#EBE5D9] rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {REGIONS.map((region) => (
            <RegionTile
              key={region.id}
              region={region}
              count={regionCounts[region.id] || 0}
              active={regionId === region.id}
              onClick={() => pickRegion(region.id)}
            />
          ))}
        </div>
      </div>

      {!regionId && (
        <p className="text-center text-sm text-slate-400 py-6">
          ↑ Choose a region to see segment rules
        </p>
      )}

      {regionId && (
        <div className="space-y-3">
          <h4 className="text-sm font-extrabold text-[#222121]">
            {activeRegion?.emoji} {activeRegion?.label}
            <span className="text-slate-400 font-medium ml-2">({regionRules.length} segments)</span>
          </h4>

          {regionRules.length === 0 ? (
            <p className="text-sm text-slate-500">No segments in this region.</p>
          ) : (
            <div className="space-y-2">
              {regionRules.map((rule) => (
                <SegmentRow
                  key={rule.id}
                  rule={rule}
                  regionId={regionId}
                  open={openIds.includes(rule.id)}
                  pinned={pinnedIds.includes(rule.id)}
                  onToggle={() => toggleOpen(rule.id)}
                  onPin={() => togglePin(rule.id)}
                />
              ))}
            </div>
          )}

          {pinnedIds.length > 1 && (
            <div className="bg-[#FFF0F3] border border-[#FFD2DB] rounded-2xl p-4 mt-4">
              <p className="text-xs font-extrabold text-[#E2004F] mb-2">
                Pinned comparison — all members
              </p>
              <p className="text-sm text-[#222121] font-medium">
                {[...new Set(
                  regionRules
                    .filter((r) => pinnedIds.includes(r.id))
                    .flatMap((r) => memberNames(r))
                )].join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-center font-mono">
        {meta.routerName} · synced {meta.builtAt?.slice(0, 10) || '—'}
      </p>
    </div>
  );
}

window.TeamsCountriesPanel = TeamsCountriesPanel;
