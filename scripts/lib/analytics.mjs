import {
  employeeMicroSegment,
  isUnitedStates,
  MICRO_SEGMENT_LABELS,
} from './normalize.mjs';

export function weekKey(iso) {
  if (!iso) return 'unknown';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'unknown';
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() - day + 1);
  return utc.toISOString().slice(0, 10);
}

export function weekLabel(weekStart) {
  if (weekStart === 'unknown') return 'Unknown';
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (x) => x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function segmentLabel(seg) {
  return MICRO_SEGMENT_LABELS[seg] || seg;
}

export function countBy(arr, fn) {
  const m = new Map();
  for (const x of arr) {
    const k = fn(x) || '(empty)';
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

export function topEntry(counts) {
  return counts[0] || null;
}

export function pct(n, d) {
  if (!d) return 0;
  return Math.round((n / d) * 1000) / 10;
}

export function buildWeeklySeries(catchAll) {
  const m = new Map();
  for (const r of catchAll) {
    const w = weekKey(r.triggeredAt);
    m.set(w, (m.get(w) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([weekStart, count]) => ({
      weekStart,
      weekLabel: weekLabel(weekStart),
      count,
    }));
}

export function buildWeeklyLeaders(catchAll) {
  const byWeek = new Map();
  for (const r of catchAll) {
    const w = weekKey(r.triggeredAt);
    if (!byWeek.has(w)) byWeek.set(w, []);
    byWeek.get(w).push(r);
  }

  return [...byWeek.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([weekStart, rows]) => {
      const topCountry = topEntry(countBy(rows, (r) => r.country));
      const topSegment = topEntry(
        countBy(rows, (r) => r.employeeMicroSegment || employeeMicroSegment(r.numberOfEmployees))
      );
      const usRows = rows.filter((r) => isUnitedStates(r.country));
      const topUsState = topEntry(countBy(usRows, (r) => r.state));
      const usUnder50 = usRows.filter((r) => {
        const n = Number(r.numberOfEmployees);
        return Number.isFinite(n) && n < 50;
      }).length;

      return {
        weekStart,
        weekLabel: weekLabel(weekStart),
        total: rows.length,
        topCountry: topCountry
          ? { name: topCountry.name, count: topCountry.count }
          : null,
        topSegment: topSegment
          ? { name: segmentLabel(topSegment.name), key: topSegment.name, count: topSegment.count }
          : null,
        topUsState: topUsState && topUsState.name !== '(empty)'
          ? { name: topUsState.name, count: topUsState.count }
          : null,
        usCatchAll: usRows.length,
        usUnder50,
        usUnder50Pct: usRows.length ? pct(usUnder50, usRows.length) : null,
      };
    });
}

export function buildRichInsights(catchAll) {
  const insights = [];
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeek = catchAll.filter((r) => new Date(r.triggeredAt) >= weekAgo);
  const prevWeek = catchAll.filter((r) => {
    const d = new Date(r.triggeredAt);
    return d >= twoWeeksAgo && d < weekAgo;
  });

  if (prevWeek.length > 0) {
    const change = pct(thisWeek.length - prevWeek.length, prevWeek.length);
    const dir = change >= 0 ? 'up' : 'down';
    insights.push({
      type: 'wow_volume',
      category: 'trend',
      severity: Math.abs(change) > 25 ? 'high' : 'normal',
      text: `Catch-All volume is ${dir} ${Math.abs(change)}% vs prior week (${thisWeek.length} vs ${prevWeek.length}).`,
    });
  }

  const countries = countBy(catchAll, (r) => r.country).filter((c) => c.name !== '(empty)');
  if (countries.length) {
    const top5 = countries.slice(0, 5);
    const list = top5.map((c) => `${c.name} (${c.count})`).join(', ');
    insights.push({
      type: 'top_countries',
      category: 'geography',
      severity: 'normal',
      text: `Countries that recur most in Catch-All: ${list}${countries.length > 5 ? ` — +${countries.length - 5} more` : ''}.`,
    });
  }

  const usRows = catchAll.filter((r) => isUnitedStates(r.country));
  if (usRows.length) {
    const under50 = usRows.filter((r) => {
      const n = Number(r.numberOfEmployees);
      return Number.isFinite(n) && n < 50;
    });
    const under50Pct = pct(under50.length, usRows.length);
    const topState = topEntry(countBy(usRows, (r) => r.state));
    const statePart =
      topState && topState.name !== '(empty)'
        ? ` Top US state: ${topState.name} (${topState.count}).`
        : '';
    insights.push({
      type: 'us_under_50',
      category: 'geography',
      severity: under50Pct > 40 ? 'high' : 'normal',
      text: `United States: ${under50Pct}% of US Catch-All have under 50 employees (${under50.length} of ${usRows.length}).${statePart}`,
    });

    const micro2049 = usRows.filter((r) => {
      const seg = r.employeeMicroSegment || employeeMicroSegment(r.numberOfEmployees);
      return seg === '20_49' || seg === 'under_20';
    });
    if (micro2049.length / usRows.length > 0.35) {
      insights.push({
        type: 'recommendation',
        category: 'recommendation',
        severity: 'high',
        text: `Recommendation: Review Concierge micro/SMB segment coverage for United States — ${pct(micro2049.length, usRows.length)}% of US Catch-All are under 50 employees.`,
      });
    }
  }

  const weekly = buildWeeklySeries(catchAll);
  if (weekly.length >= 2) {
    const last = weekly[weekly.length - 1];
    const prev = weekly[weekly.length - 2];
    if (prev.count > 0) {
      const wChange = pct(last.count - prev.count, prev.count);
      const leaders = buildWeeklyLeaders(catchAll.filter((r) => weekKey(r.triggeredAt) === last.weekStart));
      const topC = leaders[0]?.topCountry;
      const driver = topC
        ? ` Top driver: ${topC.name} (${topC.count}).`
        : '';
      insights.push({
        type: 'weekly_trend',
        category: 'trend',
        severity: Math.abs(wChange) > 30 ? 'high' : 'normal',
        text: `Latest week (${last.weekLabel}): ${last.count} Catch-All, ${wChange >= 0 ? '+' : ''}${wChange}% vs previous week.${driver}`,
      });
    }
  }

  const bands = countBy(catchAll, (r) => r.employeeBand);
  const under20 = bands.find((b) => b.name === 'under_20');
  if (under20 && catchAll.length) {
    const p = pct(under20.count, catchAll.length);
    insights.push({
      type: 'employee_band',
      category: 'segment',
      severity: p > 50 ? 'high' : 'normal',
      text: `${p}% of Catch-All have <20 employees — aligns with Scenario C (enrichment out of bookable range).`,
    });
  }

  const micro = countBy(catchAll, (r) => r.employeeMicroSegment || employeeMicroSegment(r.numberOfEmployees));
  const topMicro = topEntry(micro);
  if (topMicro && topMicro.name !== 'missing') {
    insights.push({
      type: 'top_segment',
      category: 'segment',
      severity: 'normal',
      text: `Most common employee-size segment in Catch-All: ${segmentLabel(topMicro.name)} (${topMicro.count} leads, ${pct(topMicro.count, catchAll.length)}%).`,
    });
  }

  const emailCounts = new Map();
  for (const r of catchAll) {
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
      text: `${repeats} guest email(s) submitted Catch-All more than once — worth checking duplicate routing or re-submits.`,
    });
  }

  if (countries[0]) {
    insights.push({
      type: 'recommendation',
      category: 'recommendation',
      severity: 'normal',
      text: `Recommendation: Prioritize MOPS review of ${countries[0].name} Catch-All rules (${countries[0].count} in dataset) — highest country volume.`,
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
