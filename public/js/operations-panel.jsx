/* global React, Chart */
const { useState, useEffect, useRef, useMemo } = React;

const OPS_DATA_BASE = 'data/catch_all';

const MICRO_LABELS = {
  under_20: 'Under 20',
  '20_49': '20 – 49',
  '50_99': '50 – 99',
  '100_199': '100 – 199',
  '200_499': '200 – 499',
  '500_8000': '500 – 8,000',
  over_8000: 'Over 8,000',
  missing: 'Missing',
};

function parseJsonl(text) {
  return text.split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

function microSegment(n) {
  if (n == null || n === '') return 'missing';
  const x = Number(n);
  if (!Number.isFinite(x)) return 'missing';
  if (x < 20) return 'under_20';
  if (x < 50) return '20_49';
  if (x < 100) return '50_99';
  if (x < 200) return '100_199';
  if (x < 500) return '200_499';
  if (x <= 8000) return '500_8000';
  return 'over_8000';
}

function enrichRecord(r) {
  return {
    ...r,
    state: r.state || r.contactState || r.companyState || '',
    employeeMicroSegment: r.employeeMicroSegment || microSegment(r.numberOfEmployees),
  };
}

function isUS(country) {
  const c = String(country || '').toLowerCase();
  return c === 'united states' || c === 'us' || c === 'usa';
}

function weekKey(iso) {
  if (!iso) return 'unknown';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'unknown';
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() - day + 1);
  return utc.toISOString().slice(0, 10);
}

function weekLabel(weekStart) {
  if (weekStart === 'unknown') return 'Unknown';
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (x) => x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function countBy(arr, fn) {
  const m = new Map();
  for (const x of arr) {
    const k = fn(x) || '(empty)';
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function buildWeeklyFromRows(rows) {
  const m = new Map();
  for (const r of rows) {
    const w = weekKey(r.triggeredAt);
    m.set(w, (m.get(w) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([weekStart, count]) => ({ weekStart, weekLabel: weekLabel(weekStart), count }));
}

function buildWeeklyLeadersFromRows(rows) {
  const byWeek = new Map();
  for (const r of rows) {
    const w = weekKey(r.triggeredAt);
    if (!byWeek.has(w)) byWeek.set(w, []);
    byWeek.get(w).push(r);
  }
  return [...byWeek.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([weekStart, wRows]) => {
      const topCountry = countBy(wRows, (r) => r.country)[0];
      const topSeg = countBy(wRows, (r) => r.employeeMicroSegment)[0];
      const usRows = wRows.filter((r) => isUS(r.country));
      const topState = countBy(usRows, (r) => r.state).find((s) => s.name !== '(empty)');
      const usUnder50 = usRows.filter((r) => Number(r.numberOfEmployees) < 50).length;
      return {
        weekStart,
        weekLabel: weekLabel(weekStart),
        total: wRows.length,
        topCountry,
        topSegment: topSeg ? { ...topSeg, label: MICRO_LABELS[topSeg.name] || topSeg.name } : null,
        topUsState: topState || null,
        usUnder50,
        usTotal: usRows.length,
      };
    });
}

function inDaysRange(iso, days) {
  if (!iso || !days) return true;
  return new Date(iso).getTime() >= Date.now() - days * 86400000;
}

function inLast24h(iso) {
  if (!iso) return false;
  return new Date(iso).getTime() >= Date.now() - 86400000;
}

function computeFilteredKpis(rows) {
  const now = Date.now();
  const weekMs = 7 * 86400000;
  const thisWeek = rows.filter((r) => new Date(r.triggeredAt).getTime() >= now - weekMs);
  const prevWeek = rows.filter((r) => {
    const t = new Date(r.triggeredAt).getTime();
    return t >= now - 2 * weekMs && t < now - weekMs;
  });
  const wow = prevWeek.length
    ? Math.round(((thisWeek.length - prevWeek.length) / prevWeek.length) * 1000) / 10
    : null;
  const weeks = buildWeeklyFromRows(rows);
  const avgWeekly = weeks.length
    ? Math.round((rows.length / weeks.length) * 10) / 10
    : rows.length;
  return { thisWeek: thisWeek.length, prevWeek: prevWeek.length, wow, avgWeekly, weekCount: weeks.length };
}

function buildPanelInsights(rows) {
  const insights = [];
  if (!rows.length) {
    insights.push({
      type: 'empty',
      category: 'quality',
      severity: 'low',
      text: 'No Catch-All records in the last 24 hours.',
    });
    return insights;
  }

  const now = Date.now();
  const weekMs = 7 * 86400000;
  const thisWeek = rows.filter((r) => new Date(r.triggeredAt).getTime() >= now - weekMs);
  const prevWeek = rows.filter((r) => {
    const t = new Date(r.triggeredAt).getTime();
    return t >= now - 2 * weekMs && t < now - weekMs;
  });

  if (prevWeek.length > 0) {
    const change = Math.round(((thisWeek.length - prevWeek.length) / prevWeek.length) * 1000) / 10;
    const dir = change >= 0 ? 'up' : 'down';
    insights.push({
      type: 'wow_volume',
      category: 'trend',
      severity: Math.abs(change) > 25 ? 'high' : 'normal',
      text: `Volume is ${dir} ${Math.abs(change)}% vs prior week (${thisWeek.length} vs ${prevWeek.length} in window).`,
    });
  }

  const countries = countBy(rows, (r) => r.country).filter((c) => c.name !== '(empty)');
  if (countries.length) {
    const top5 = countries.slice(0, 5);
    insights.push({
      type: 'top_countries',
      category: 'geography',
      severity: 'normal',
      text: `Top countries: ${top5.map((c) => `${c.name} (${c.count})`).join(', ')}${countries.length > 5 ? ` — +${countries.length - 5} more` : ''}.`,
    });
  }

  const usRows = rows.filter((r) => isUS(r.country));
  if (usRows.length) {
    const under50 = usRows.filter((r) => Number(r.numberOfEmployees) < 50);
    const under50Pct = usRows.length ? Math.round((under50.length / usRows.length) * 1000) / 10 : 0;
    const topState = countBy(usRows, (r) => r.state).find((s) => s.name !== '(empty)');
    insights.push({
      type: 'us_under_50',
      category: 'geography',
      severity: under50Pct > 40 ? 'high' : 'normal',
      text: `United States: ${under50Pct}% under 50 employees (${under50.length}/${usRows.length}).${topState ? ` Top state: ${topState.name} (${topState.count}).` : ''}`,
    });
    if (under50.length / usRows.length > 0.35) {
      insights.push({
        type: 'recommendation',
        category: 'recommendation',
        severity: 'high',
        text: `Review Concierge micro/SMB coverage for US — ${Math.round((under50.length / usRows.length) * 1000) / 10}% of US Catch-All are under 50 employees.`,
      });
    }
  }

  const weekly = buildWeeklyFromRows(rows);
  if (weekly.length >= 1) {
    const last = weekly[weekly.length - 1];
    const prev = weekly.length >= 2 ? weekly[weekly.length - 2] : null;
    const wChange = prev && prev.count > 0
      ? Math.round(((last.count - prev.count) / prev.count) * 1000) / 10
      : null;
    const weekRows = rows.filter((r) => weekKey(r.triggeredAt) === last.weekStart);
    const topC = countBy(weekRows, (r) => r.country)[0];
    insights.push({
      type: 'weekly_trend',
      category: 'trend',
      severity: wChange != null && Math.abs(wChange) > 30 ? 'high' : 'normal',
      text: `Latest week (${last.weekLabel}): ${last.count} Catch-All${wChange != null ? `, ${wChange >= 0 ? '+' : ''}${wChange}% vs prior week` : ''}.${topC ? ` Top driver: ${topC.name} (${topC.count}).` : ''}`,
    });
  }

  const under20 = rows.filter((r) => r.employeeBand === 'under_20' || r.employeeMicroSegment === 'under_20').length;
  if (under20) {
    const p = Math.round((under20 / rows.length) * 1000) / 10;
    insights.push({
      type: 'employee_band',
      category: 'segment',
      severity: p > 50 ? 'high' : 'normal',
      text: `${p}% have under 20 employees — aligns with Scenario C (out of bookable range).`,
    });
  }

  const micro = countBy(rows, (r) => r.employeeMicroSegment);
  const topMicro = micro[0];
  if (topMicro && topMicro.name !== 'missing') {
    insights.push({
      type: 'top_segment',
      category: 'segment',
      severity: 'normal',
      text: `Top size segment: ${MICRO_LABELS[topMicro.name] || topMicro.name} (${topMicro.count}, ${Math.round((topMicro.count / rows.length) * 1000) / 10}%).`,
    });
  }

  const emailCounts = new Map();
  for (const r of rows) {
    const e = (r.guestEmail || '').toLowerCase();
    if (!e) continue;
    emailCounts.set(e, (emailCounts.get(e) || 0) + 1);
  }
  const repeats = [...emailCounts.values()].filter((c) => c > 1).length;
  if (repeats > 0) {
    insights.push({
      type: 'repeat_visitors',
      category: 'quality',
      severity: 'low',
      text: `${repeats} guest email(s) submitted Catch-All more than once in this window.`,
    });
  }

  if (countries[0]) {
    insights.push({
      type: 'recommendation',
      category: 'recommendation',
      severity: 'normal',
      text: `Prioritize MOPS review for ${countries[0].name} (${countries[0].count} in last 24h) — highest volume.`,
    });
  }

  insights.push({
    type: 'doc_alignment',
    category: 'reference',
    severity: 'normal',
    text: 'Scenario F: no Concierge segment match — lead continues in Marketo for Catch-All list review.',
  });

  return insights;
}

const BAND_LABELS = {
  under_20: '< 20',
  in_range: '20 – 8,000',
  over_8000: '> 8,000',
  missing: 'Missing',
};

const INSIGHT_ICONS = {
  geography: '🌍',
  segment: '👥',
  trend: '📈',
  recommendation: '💡',
  quality: '🔍',
  reference: '📌',
};

function formatInsightWindow(start, end) {
  const opts = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' };
  return `${start.toLocaleString('en-US', opts)} → ${end.toLocaleString('en-US', opts)} UTC`;
}

function InsightCard({ insight }) {
  const styles = {
    high: 'border-l-4 border-l-rose-500 bg-rose-50/80 border border-rose-100',
    low: 'border-l-4 border-l-slate-300 bg-slate-50/80 border border-slate-100',
    normal: 'border-l-4 border-l-[#E2004F] bg-white border border-[#EBE5D9]',
  }[insight.severity] || 'border-l-4 border-l-[#E2004F] bg-white border border-[#EBE5D9]';

  return (
    <li className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed text-slate-700 ${styles}`}>
      {insight.text}
    </li>
  );
}

function InsightsPatternsPanel({ insights, windowStart, windowEnd }) {
  const categories = ['trend', 'geography', 'segment', 'quality', 'recommendation', 'reference'];

  return (
    <div className="bg-white border border-[#EBE5D9] rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-[#EBE5D9] bg-gradient-to-br from-[#222121] via-[#2d2b2b] to-[#1a1919] text-white">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-extrabold tracking-tight">Insights &amp; patterns</h4>
            <p className="text-[11px] text-slate-300 mt-1 max-w-md">
              Fixed snapshot from the last 24 hours — not affected by the filters above.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E2004F] text-white shadow">
              Last 24h
            </span>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">{formatInsightWindow(windowStart, windowEnd)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{insights.length} insight{insights.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const items = (insights || []).filter((i) => i.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} className="rounded-xl border border-[#EBE5D9] bg-[#FAF8F5]/50 p-3 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#EBE5D9]/80">
                <span className="text-base leading-none">{INSIGHT_ICONS[cat]}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#222121]">
                  {INSIGHT_CATEGORY_LABELS[cat]}
                </span>
                <span className="ml-auto text-[10px] font-bold text-slate-400">{items.length}</span>
              </div>
              <ul className="space-y-2 flex-1">
                {items.map((ins, i) => (
                  <InsightCard key={`${ins.type}-${i}`} insight={ins} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendationsPanel({ insights, windowStart, windowEnd }) {
  const items = (insights || []).filter((i) => i.category === 'recommendation');
  if (!items.length) return null;
  return (
    <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 max-h-80 overflow-y-auto custom-scroll flex flex-col">
      <div className="shrink-0 mb-3">
        <h4 className="text-xs font-extrabold uppercase text-rose-700 tracking-wider">Recommendations</h4>
        <p className="text-[10px] text-slate-400 mt-1">
          Last 24h · {formatInsightWindow(windowStart, windowEnd)}
        </p>
      </div>
      <ul className="space-y-2 flex-1">
        {items.map((ins, i) => (
          <InsightCard key={`rec-${i}`} insight={ins} />
        ))}
      </ul>
    </div>
  );
}

function ActiveFilterSummary({ days, country, usState, band, microSeg, search, count }) {
  const chips = [];
  if (days) chips.push(days === 0 ? 'All time' : `Last ${days} days`);
  if (country) chips.push(country);
  if (usState) chips.push(`State: ${usState}`);
  if (microSeg) chips.push(MICRO_LABELS[microSeg] || microSeg);
  if (band) chips.push(BAND_LABELS[band] || band);
  if (search.trim()) chips.push(`Search: “${search.trim()}”`);

  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px]">
      <span className="font-extrabold uppercase text-slate-400 tracking-wider">Filtered view</span>
      {chips.length === 0 ? (
        <span className="text-slate-500">All records in selected period</span>
      ) : (
        chips.map((c) => (
          <span key={c} className="px-2 py-0.5 rounded-full bg-[#FFF0F3] border border-[#FFD2DB] text-[#E2004F] font-bold">{c}</span>
        ))
      )}
      <span className="ml-auto font-bold text-[#222121]">{count} record{count !== 1 ? 's' : ''}</span>
    </div>
  );
}

function exportCsv(rows) {
  const headers = [
    'triggeredAt', 'guestEmail', 'company', 'country', 'state', 'numberOfEmployees',
    'employeeMicroSegment', 'status', 'crmRecord',
  ];
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `catch-all-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

const INSIGHT_CATEGORY_LABELS = {
  geography: 'Geography',
  segment: 'Employee segments',
  trend: 'Trends',
  recommendation: 'Recommendations',
  quality: 'Data quality',
  reference: 'Reference',
};

function BreakdownCard({ title, items, nameFn }) {
  return (
    <div className="bg-white border border-[#EBE5D9] rounded-2xl p-4">
      <h4 className="text-xs font-extrabold uppercase text-slate-500 mb-3">{title}</h4>
      <ul className="space-y-1.5 text-xs">
        {(items || []).slice(0, 10).map((row) => (
          <li key={row.name || row.key} className="flex justify-between gap-2">
            <span className="text-slate-600 truncate">{nameFn ? nameFn(row) : row.name}</span>
            <span className="font-bold text-[#222121] shrink-0">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OperationsPanel({ initialDays = 30, onOpenScenario }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aggregates, setAggregates] = useState(null);
  const [meta, setMeta] = useState(null);
  const [records, setRecords] = useState([]);
  const [days, setDays] = useState(initialDays);
  const [country, setCountry] = useState('');
  const [usState, setUsState] = useState('');
  const [band, setBand] = useState('');
  const [microSeg, setMicroSeg] = useState('');
  const [search, setSearch] = useState('');
  const [trendMode, setTrendMode] = useState('weekly');
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    setDays(initialDays);
  }, [initialDays]);

  useEffect(() => {
    let cancelled = false;
    const embedded = window.__PORTAL_DATA__ && window.__PORTAL_DATA__.catchAll;
    if (embedded) {
      setAggregates(embedded.aggregates || null);
      setRecords(parseJsonl(embedded.recordsJsonl || '').map(enrichRecord));
      setMeta(embedded.meta || {});
      setError(null);
      setLoading(false);
      return undefined;
    }
    (async () => {
      try {
        const [aggRes, recRes, metaRes] = await Promise.all([
          fetch(`${OPS_DATA_BASE}/aggregates.json`),
          fetch(`${OPS_DATA_BASE}/records.jsonl`),
          fetch(`${OPS_DATA_BASE}/meta.json`),
        ]);
        if (!aggRes.ok) throw new Error('Could not load aggregates.json — run npm run sync');
        const agg = await aggRes.json();
        const recText = recRes.ok ? await recRes.text() : '';
        const metaJson = metaRes.ok ? await metaRes.json() : {};
        if (cancelled) return;
        setAggregates(agg);
        setRecords(parseJsonl(recText).map(enrichRecord));
        setMeta(metaJson);
        setError(null);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      if (!inDaysRange(r.triggeredAt, days)) return false;
      if (country && r.country !== country) return false;
      if (usState) {
        if (!isUS(r.country) || r.state !== usState) return false;
      }
      if (band && r.employeeBand !== band) return false;
      if (microSeg && r.employeeMicroSegment !== microSeg) return false;
      if (q) {
        const hay = `${r.guestEmail} ${r.company} ${r.country} ${r.state}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [records, days, country, usState, band, microSeg, search]);

  const weeklySeries = useMemo(() => buildWeeklyFromRows(filtered), [filtered]);
  const weeklyLeaders = useMemo(() => buildWeeklyLeadersFromRows(filtered), [filtered]);

  const filteredDaily = useMemo(() => {
    const m = new Map();
    for (const r of filtered) {
      const d = r.triggeredAt ? r.triggeredAt.slice(0, 10) : 'unknown';
      m.set(d, (m.get(d) || 0) + 1);
    }
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const clientBreakdowns = useMemo(() => {
    const usRows = filtered.filter((r) => isUS(r.country));
    return {
      countries: countBy(filtered, (r) => r.country),
      usStates: countBy(usRows, (r) => r.state).filter((s) => s.name !== '(empty)'),
      microSegments: countBy(filtered, (r) => r.employeeMicroSegment).map((x) => ({
        ...x,
        label: MICRO_LABELS[x.name] || x.name,
      })),
      employeeBands: countBy(filtered, (r) => r.employeeBand).map((x) => ({
        ...x,
        label: BAND_LABELS[x.name] || x.name,
      })),
      formPages: countBy(filtered, (r) => r.formPage),
    };
  }, [filtered]);

  const filteredKpis = useMemo(() => computeFilteredKpis(filtered), [filtered]);

  const insightsWindow = useMemo(() => ({
    start: new Date(Date.now() - 86400000),
    end: new Date(),
  }), [records]);

  const insights24h = useMemo(() => {
    const rows = records.filter((r) => inLast24h(r.triggeredAt));
    return buildPanelInsights(rows);
  }, [records]);

  const countries = useMemo(() => {
    const s = new Set(records.map((r) => r.country).filter(Boolean));
    return [...s].sort();
  }, [records]);

  const usStates = useMemo(() => {
    const s = new Set(
      records.filter((r) => isUS(r.country) && r.state).map((r) => r.state)
    );
    return [...s].sort();
  }, [records]);

  useEffect(() => {
    if (!chartRef.current || typeof Chart === 'undefined') return;
    const isWeekly = trendMode === 'weekly';
    const labels = isWeekly
      ? weeklySeries.map((w) => w.weekLabel)
      : filteredDaily.map(([d]) => d);
    const data = isWeekly
      ? weeklySeries.map((w) => w.count)
      : filteredDaily.map(([, c]) => c);

    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Catch-All',
          data,
          backgroundColor: '#E2004F',
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: false,
          },
        },
        scales: {
          x: { ticks: { maxRotation: 45, font: { size: 9 } } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [weeklySeries, filteredDaily, trendMode]);

  if (loading) {
    return (
      <div className="bg-white border border-[#EBE5D9] rounded-3xl p-12 text-center text-sm text-slate-500 animate-fadeIn">
        Loading Catch-All data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center animate-fadeIn">
        <p className="text-sm font-bold text-rose-800">{error}</p>
        <p className="text-xs text-rose-600 mt-2">Run <code className="bg-white px-1 rounded">npm run sync</code> locally or wait for the daily GitHub Action.</p>
      </div>
    );
  }

  const syncAgeHours = meta?.lastSyncAt
    ? (Date.now() - new Date(meta.lastSyncAt).getTime()) / 3600000
    : null;
  const isStaleSync = syncAgeHours != null && syncAgeHours > 26;
  const dataMaxDay = aggregates?.dateRange?.max
    ? new Date(aggregates.dateRange.max).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      {isStaleSync && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-amber-900">
            <span className="font-extrabold">Data may be stale.</span>{' '}
            Last sync was {Math.round(syncAgeHours)}h ago
            {dataMaxDay ? ` — newest record: ${dataMaxDay}` : ''}.
            The daily GitHub Action refreshes this dashboard when <code className="bg-white px-1 rounded text-xs">CHILI_PIPER_API_KEY</code> is configured.
          </p>
        </div>
      )}
      <div className="bg-gradient-to-r from-[#FFF0F3] to-white border border-[#FFD2DB] rounded-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-[#E2004F] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#FFD2DB]">Catch-All Dashboard</span>
            <h3 className="text-xl font-extrabold text-[#222121] mt-2">Concierge Catch-All Monitor</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Weekly trends, country &amp; US state patterns, and employee-size segments for Scenario F (Catch All).
              {meta?.lastSyncAt && (
                <span className="block mt-1 text-[10px] text-slate-400">Last sync: {new Date(meta.lastSyncAt).toLocaleString()}</span>
              )}
            </p>
          </div>
          {onOpenScenario && (
            <button type="button" onClick={() => onOpenScenario('F')} className="text-xs font-bold text-[#E2004F] bg-white border border-[#FFD2DB] px-4 py-2 rounded-xl hover:bg-[#FFF0F3]">
              View Scenario F logic →
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#EBE5D9] rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        <p className="w-full text-[10px] text-slate-400 -mb-1">
          KPIs, charts, breakdowns, and review queue follow these filters. Insights below are fixed to the last 24 hours.
        </p>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Period</label>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="text-xs border rounded-lg px-3 py-2 bg-slate-50">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 6 months</option>
            <option value={0}>All data</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Country</label>
          <select value={country} onChange={(e) => { setCountry(e.target.value); setUsState(''); }} className="text-xs border rounded-lg px-3 py-2 bg-slate-50 max-w-[160px]">
            <option value="">All</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">US state</label>
          <select value={usState} onChange={(e) => setUsState(e.target.value)} disabled={country && !isUS(country)} className="text-xs border rounded-lg px-3 py-2 bg-slate-50 max-w-[140px] disabled:opacity-40">
            <option value="">All states</option>
            {usStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Size segment</label>
          <select value={microSeg} onChange={(e) => setMicroSeg(e.target.value)} className="text-xs border rounded-lg px-3 py-2 bg-slate-50 max-w-[130px]">
            <option value="">All segments</option>
            {Object.entries(MICRO_LABELS).map(([k, lbl]) => (
              <option key={k} value={k}>{lbl}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Band (routing)</label>
          <select value={band} onChange={(e) => setBand(e.target.value)} className="text-xs border rounded-lg px-3 py-2 bg-slate-50">
            <option value="">All</option>
            <option value="under_20">&lt; 20</option>
            <option value="in_range">20 – 8,000</option>
            <option value="over_8000">&gt; 8,000</option>
            <option value="missing">Missing</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Search</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Email, company, state…" className="w-full text-xs border rounded-lg px-3 py-2" />
        </div>
        <button type="button" onClick={() => exportCsv(filtered)} className="text-xs font-bold bg-[#222121] text-white px-4 py-2 rounded-xl">
          Export CSV
        </button>
      </div>

      <ActiveFilterSummary
        days={days}
        country={country}
        usState={usState}
        band={band}
        microSeg={microSeg}
        search={search}
        count={filtered.length}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'In period',
            value: filtered.length,
            sub: days ? `Filtered · last ${days} days` : 'Filtered · all time',
          },
          {
            label: 'This week',
            value: filteredKpis.thisWeek,
            sub: filteredKpis.wow != null
              ? `${filteredKpis.wow > 0 ? '+' : ''}${filteredKpis.wow}% vs prev week (filtered)`
              : 'Within filtered set',
          },
          {
            label: 'Avg / week',
            value: filteredKpis.avgWeekly,
            sub: filteredKpis.weekCount
              ? `${filteredKpis.weekCount} week${filteredKpis.weekCount !== 1 ? 's' : ''} in view`
              : 'In filtered period',
          },
          {
            label: 'US under 50',
            value: (() => {
              const us = filtered.filter((r) => isUS(r.country));
              const u50 = us.filter((r) => Number(r.numberOfEmployees) < 50).length;
              return us.length ? `${Math.round((u50 / us.length) * 100)}%` : '—';
            })(),
            sub: 'Share of filtered US Catch-All',
          },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-[#EBE5D9] rounded-2xl p-4 shadow-xs">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-extrabold text-[#222121] mt-1">{card.value}</p>
            <p className="text-[10px] text-slate-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#EBE5D9] rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                {trendMode === 'weekly' ? 'Weekly Catch-All trend' : 'Daily Catch-All trend'}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Updates with filters above</p>
            </div>
            <div className="flex bg-[#F5F1E9] p-0.5 rounded-lg border border-[#EBE5D9]">
              <button type="button" onClick={() => setTrendMode('weekly')} className={`px-3 py-1 text-[10px] font-bold rounded-md ${trendMode === 'weekly' ? 'bg-[#222121] text-white' : 'text-slate-500'}`}>Weekly</button>
              <button type="button" onClick={() => setTrendMode('daily')} className={`px-3 py-1 text-[10px] font-bold rounded-md ${trendMode === 'daily' ? 'bg-[#222121] text-white' : 'text-slate-500'}`}>Daily</button>
            </div>
          </div>
          <div className="h-56 relative">
            <canvas ref={chartRef} />
          </div>
        </div>
        <RecommendationsPanel
          insights={insights24h}
          windowStart={insightsWindow.start}
          windowEnd={insightsWindow.end}
        />
      </div>

      <InsightsPatternsPanel
        insights={insights24h}
        windowStart={insightsWindow.start}
        windowEnd={insightsWindow.end}
      />

      <div className="bg-white border border-[#EBE5D9] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#EBE5D9] bg-[#FAF8F5]">
          <h4 className="text-xs font-extrabold uppercase text-slate-600">Weekly leaders — top country &amp; segment per week</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Filtered view · geography and employee-size drivers per week</p>
        </div>
        <div className="overflow-x-auto max-h-[320px] custom-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-white sticky top-0 text-[9px] uppercase text-slate-400 font-extrabold border-b">
              <tr>
                <th className="py-2 px-3">Week</th>
                <th className="py-2 px-3">Total</th>
                <th className="py-2 px-3">Top country</th>
                <th className="py-2 px-3">Top segment</th>
                <th className="py-2 px-3">Top US state</th>
                <th className="py-2 px-3">US &lt;50</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeklyLeaders.map((w) => (
                <tr key={w.weekStart} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium whitespace-nowrap">{w.weekLabel}</td>
                  <td className="py-2 px-3 font-bold">{w.total}</td>
                  <td className="py-2 px-3">
                    {w.topCountry ? `${w.topCountry.name} (${w.topCountry.count})` : '—'}
                  </td>
                  <td className="py-2 px-3">
                    {w.topSegment ? `${w.topSegment.label} (${w.topSegment.count})` : '—'}
                  </td>
                  <td className="py-2 px-3">
                    {w.topUsState ? `${w.topUsState.name} (${w.topUsState.count})` : '—'}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    {w.usTotal > 0 ? `${w.usUnder50}/${w.usTotal}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BreakdownCard title="Top countries (filtered)" items={clientBreakdowns.countries} />
        <BreakdownCard title="US states (filtered)" items={clientBreakdowns.usStates} />
        <BreakdownCard
          title="Employee size segments"
          items={clientBreakdowns.microSegments}
          nameFn={(r) => r.label}
        />
        <BreakdownCard
          title="Routing bands"
          items={clientBreakdowns.employeeBands}
          nameFn={(r) => r.label}
        />
      </div>

      <div className="bg-white border border-[#EBE5D9] rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#EBE5D9] flex justify-between items-center">
          <h4 className="text-xs font-extrabold uppercase text-slate-500">Review queue ({filtered.length})</h4>
        </div>
        <div className="overflow-x-auto max-h-[400px] custom-scroll">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] sticky top-0 z-10 text-[9px] uppercase text-slate-400 font-extrabold">
              <tr>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Guest</th>
                <th className="py-2 px-3">Company</th>
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Employees</th>
                <th className="py-2 px-3">Segment</th>
                <th className="py-2 px-3">CRM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.slice(0, 200).map((r) => (
                <tr key={r.dedupeKey} className="hover:bg-slate-50">
                  <td className="py-2 px-3 whitespace-nowrap text-slate-500">{r.triggeredAt?.slice(0, 10)}</td>
                  <td className="py-2 px-3 font-medium">{r.guestEmail}</td>
                  <td className="py-2 px-3">{r.company}</td>
                  <td className="py-2 px-3">{r.country}</td>
                  <td className="py-2 px-3">{r.state || '—'}</td>
                  <td className="py-2 px-3 font-mono">{r.numberOfEmployees ?? '—'}</td>
                  <td className="py-2 px-3 text-slate-500">{MICRO_LABELS[r.employeeMicroSegment] || '—'}</td>
                  <td className="py-2 px-3">
                    {r.crmRecord ? (
                      <a href={r.crmRecord} target="_blank" rel="noopener noreferrer" className="text-[#E2004F] font-bold hover:underline">SF ↗</a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 200 && (
          <p className="text-[10px] text-slate-400 px-5 py-2 border-t">Showing 200 of {filtered.length}.</p>
        )}
      </div>

      <details className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500">
        <summary className="font-bold text-slate-600 cursor-pointer">Form pages (filtered)</summary>
        <ul className="mt-3 space-y-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {clientBreakdowns.formPages.slice(0, 12).map((f) => (
            <li key={f.name} className="flex justify-between bg-white px-2 py-1 rounded border">
              <span>{f.name || '(empty)'}</span>
              <span className="font-bold">{f.count}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

window.OperationsPanel = OperationsPanel;
