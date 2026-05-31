/* global React */
const { useState, useEffect, useMemo } = React;

const DATA_URL = 'data/router_teams/inbound-router-live.json';

/** Inbound router regions (matches spreadsheet territory groupings) */
const REGIONS = [
  {
    id: 'apj',
    label: 'APJ',
    match: (name) => /^APJ\s*\|/i.test(name),
  },
  {
    id: 'dach',
    label: 'DACH',
    match: (name) => /^DACH\s*\|/i.test(name),
  },
  {
    id: 'neb',
    label: 'Nordics / Benelux / EuroWest / Iberia',
    shortLabel: 'Nordics · Benelux · EuroWest · Iberia',
    match: (name) => /^(Nordics|Benelux|Western Europe|EuroWest|Iberia)\s*\|/i.test(name),
  },
  {
    id: 'ilcee',
    label: 'IL/CEE',
    match: (name) => /^IL\s*&\s*CEE/i.test(name),
  },
  {
    id: 'uki',
    label: 'UKI & ROW',
    match: (name) => /^UKI\s*&\s*ROW/i.test(name),
  },
  {
    id: 'us',
    label: 'US',
    match: (name) => /^US\s*\|/i.test(name),
  },
  {
    id: 'ca',
    label: 'Canada',
    match: (name) => /^Canada\s*\|/i.test(name),
  },
  {
    id: 'latam',
    label: 'LATAM',
    match: (name) => /^LATAM\s*\|/i.test(name),
  },
];

function displayRuleName(name) {
  return String(name || '')
    .replace(/\s*\((evaluating|updated|AAEs|RAD)\)\s*/gi, '')
    .replace(/\s*-\s*RAD\s*$/i, '')
    .trim();
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
    return displayRuleName(a.name).localeCompare(displayRuleName(b.name));
  });
}

function getRegionForRule(rule) {
  const name = rule.name || '';
  return REGIONS.find((r) => r.match(name)) || null;
}

function TeamsCountriesPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [regionId, setRegionId] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [showEvaluating, setShowEvaluating] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const embedded = window.__PORTAL_DATA__ && window.__PORTAL_DATA__.routerTeams;
    if (embedded) {
      setData(embedded);
      setError(null);
      setLoading(false);
      return undefined;
    }
    (async () => {
      try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error('Could not load router teams — run npm run build:router-teams');
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
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
      if (r.flags?.ownership || r.flags?.spam) return false;
      const n = (r.name || '').toLowerCase();
      if (n === 'ownership') return false;
      if (/customer\/churn|notrelevant|spam|test domain/i.test(n)) return false;
      return getRegionForRule(r) != null;
    });
  }, [data]);

  const regionRules = useMemo(() => {
    if (!regionId) return [];
    const region = REGIONS.find((r) => r.id === regionId);
    if (!region) return [];
    return sortRules(
      routableRules.filter((rule) => {
        if (!showEvaluating && rule.flags?.evaluating) return false;
        return region.match(rule.name);
      })
    );
  }, [routableRules, regionId, showEvaluating]);

  const teamsInRegion = useMemo(() => {
    const names = new Map();
    for (const rule of regionRules) {
      const t = rule.team?.name;
      if (t) names.set(t, (names.get(t) || 0) + 1);
    }
    return [...names.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [regionRules]);

  const filteredSegments = useMemo(() => {
    if (!teamFilter) return regionRules;
    return regionRules.filter((r) => r.team?.name === teamFilter);
  }, [regionRules, teamFilter]);

  const selectedRule = useMemo(
    () => filteredSegments.find((r) => r.id === selectedRuleId) || null,
    [filteredSegments, selectedRuleId]
  );

  const selectRegion = (id) => {
    setRegionId(id);
    setTeamFilter('');
    setSelectedRuleId(null);
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-sm text-slate-500 animate-pulse">
        Loading Teams &amp; Countries…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-sm text-rose-900">
        <p className="font-bold">Could not load routing teams</p>
        <p className="mt-2 text-xs">{error}</p>
      </div>
    );
  }

  const meta = data?.meta || {};

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="bg-white border border-[#EBE5D9] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-[#222121]">Teams &amp; Countries</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          MQL Inbound Router (live) — pick a <strong>region</strong>, then a segment rule, to see the assigned team
          (spreadsheet column I) and members.
        </p>
        <p className="text-[10px] text-slate-400 mt-2 font-mono">
          {meta.routerName} · {meta.ruleCount} rules · synced {meta.builtAt?.slice(0, 10) || '—'}
        </p>
      </div>

      {/* Step 1: Region */}
      <section>
        <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3">
          1 · Select region
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {REGIONS.map((region) => {
            const count = routableRules.filter((r) => region.match(r.name)).length;
            const active = regionId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => selectRegion(region.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-[#E2004F] bg-[#FFF0F3] shadow-sm'
                    : 'border-[#EBE5D9] bg-white hover:border-slate-400'
                }`}
              >
                <span className={`text-xs font-extrabold leading-snug block ${active ? 'text-[#E2004F]' : 'text-[#222121]'}`}>
                  {region.shortLabel || region.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">{count} segments</span>
              </button>
            );
          })}
        </div>
      </section>

      {!regionId && (
        <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-8 text-center text-sm text-slate-500">
          Choose a region above to see segment rules and teams.
        </div>
      )}

      {regionId && (
        <>
          {/* Step 2: Optional team filter */}
          <section className="bg-white border border-[#EBE5D9] rounded-2xl p-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3">
              2 · Filter by team (optional)
            </h4>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => { setTeamFilter(''); setSelectedRuleId(null); }}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                  !teamFilter ? 'bg-[#222121] text-white border-[#222121]' : 'bg-white text-slate-600 border-[#EBE5D9]'
                }`}
              >
                All teams ({regionRules.length})
              </button>
              {teamsInRegion.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => { setTeamFilter(t.name); setSelectedRuleId(null); }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border max-w-[220px] truncate ${
                    teamFilter === t.name
                      ? 'bg-[#E2004F] text-white border-[#E2004F]'
                      : 'bg-white text-slate-600 border-[#EBE5D9] hover:border-[#E2004F]'
                  }`}
                  title={t.name}
                >
                  {t.name} ({t.count})
                </button>
              ))}
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showEvaluating}
                onChange={(e) => setShowEvaluating(e.target.checked)}
                className="rounded"
              />
              Show evaluating rules
            </label>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Step 3: Segment list */}
            <section className="lg:col-span-5">
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3">
                3 · Segment rules
              </h4>
              {filteredSegments.length === 0 ? (
                <p className="text-sm text-slate-500 p-4 bg-slate-50 rounded-xl border">No segments for this filter.</p>
              ) : (
                <ul className="space-y-2 max-h-[480px] overflow-y-auto custom-scroll pr-1">
                  {filteredSegments.map((rule) => {
                    const active = selectedRuleId === rule.id;
                    const label = displayRuleName(rule.name);
                    return (
                      <li key={rule.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedRuleId(rule.id)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            active
                              ? 'border-[#E2004F] bg-[#FFF0F3]'
                              : 'border-[#EBE5D9] bg-white hover:border-slate-300'
                          }`}
                        >
                          <p className={`text-xs font-extrabold leading-snug ${active ? 'text-[#E2004F]' : 'text-[#222121]'}`}>
                            {label}
                          </p>
                          {rule.team?.name && (
                            <p className="text-[10px] text-slate-400 mt-1 truncate" title={rule.team.name}>
                              Team: {rule.team.name}
                            </p>
                          )}
                          {rule.flags?.evaluating && (
                            <span className="inline-block mt-1 text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                              evaluating
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Step 4: Team detail (column I) */}
            <section className="lg:col-span-7">
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3">
                4 · Team (column I)
              </h4>
              {!selectedRule ? (
                <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-8 text-center text-sm text-slate-500 min-h-[200px] flex items-center justify-center">
                  Select a segment rule to view its team and roster.
                </div>
              ) : (
                <div className="bg-white border-2 border-[#E2004F] rounded-2xl p-6 shadow-sm space-y-4">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">Segment</p>
                    <p className="text-sm font-extrabold text-[#222121] mt-1">{displayRuleName(selectedRule.name)}</p>
                  </div>

                  {selectedRule.employeeRange?.label && (
                    <p className="text-xs text-slate-600">
                      Employees: <span className="font-bold">{selectedRule.employeeRange.label}</span>
                    </p>
                  )}

                  <div className="border-t border-[#EBE5D9] pt-4">
                    <p className="text-[10px] uppercase text-[#E2004F] font-extrabold tracking-wider">Assigned team</p>
                    {selectedRule.team ? (
                      <>
                        <p className="text-xl font-extrabold text-[#222121] mt-2">{selectedRule.team.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {selectedRule.team.memberCount} member{selectedRule.team.memberCount !== 1 ? 's' : ''} in Chili Piper
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-rose-600 font-semibold mt-2">No team matched in export</p>
                    )}
                  </div>

                  {selectedRule.countries?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider mb-2">Countries in rule</p>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scroll">
                        {selectedRule.countries.map((c) => (
                          <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EBE5D9] text-slate-600">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRule.team?.members?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider mb-2">Team members</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto custom-scroll">
                        {selectedRule.team.members.map((m, i) => (
                          <li
                            key={m.id || i}
                            className="text-xs bg-[#FAF8F5] border border-[#EBE5D9] rounded-lg px-3 py-2 font-medium text-[#222121]"
                          >
                            {m.name || m.email || m.id}
                          </li>
                        ))}
                      </ul>
                      {!selectedRule.team.members.some((m) => m.name) && (
                        <p className="text-[10px] text-slate-400 mt-2 italic">
                          Names require a Chili Piper users export — IDs shown when unavailable.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

window.TeamsCountriesPanel = TeamsCountriesPanel;
