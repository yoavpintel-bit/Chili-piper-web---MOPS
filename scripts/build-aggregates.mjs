#!/usr/bin/env node
import fs from 'fs';
import {
  AGGREGATES_PATH,
  META_PATH,
  RECORDS_PATH,
} from './lib/paths.mjs';
import { isCatchAll, isUnitedStates } from './lib/normalize.mjs';
import {
  buildRichInsights,
  buildWeeklyLeaders,
  buildWeeklySeries,
  countBy,
  pct,
  segmentLabel,
} from './lib/analytics.mjs';

function readJsonl(path) {
  if (!fs.existsSync(path)) return [];
  return fs
    .readFileSync(path, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function dayKey(iso) {
  if (!iso) return 'unknown';
  return iso.slice(0, 10);
}

export function buildAggregates(allRecords) {
  const catchAll = allRecords.filter((r) => r.isCatchAll);
  const dates = catchAll
    .map((r) => r.triggeredAt)
    .filter(Boolean)
    .sort();
  const minDate = dates[0] || null;
  const maxDate = dates[dates.length - 1] || null;

  const dailyMap = new Map();
  for (const r of catchAll) {
    const d = dayKey(r.triggeredAt);
    dailyMap.set(d, (dailyMap.get(d) || 0) + 1);
  }
  const daily = [...dailyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  const weekly = buildWeeklySeries(catchAll);
  const weeklyLeaders = buildWeeklyLeaders(catchAll);

  const now = new Date();
  const today = dayKey(now.toISOString());
  const yesterday = dayKey(new Date(now.getTime() - 86400000).toISOString());

  const todayCount = catchAll.filter((r) => dayKey(r.triggeredAt) === today).length;
  const yesterdayCount = catchAll.filter((r) => dayKey(r.triggeredAt) === yesterday).length;

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const thisWeekCount = catchAll.filter((r) => new Date(r.triggeredAt) >= weekAgo).length;
  const prevWeekCount = catchAll.filter((r) => {
    const d = new Date(r.triggeredAt);
    return d >= twoWeeksAgo && d < weekAgo;
  }).length;
  const wowChangePct =
    prevWeekCount > 0
      ? Math.round(((thisWeekCount - prevWeekCount) / prevWeekCount) * 1000) / 10
      : null;

  const last30 = new Date(now);
  last30.setDate(last30.getDate() - 30);
  const last30Catch = catchAll.filter((r) => new Date(r.triggeredAt) >= last30);
  const avgDaily30 =
    last30Catch.length > 0 ? Math.round((last30Catch.length / 30) * 10) / 10 : 0;
  const avgWeekly30 =
    last30Catch.length > 0 ? Math.round((last30Catch.length / 4.3) * 10) / 10 : 0;

  const usRows = catchAll.filter((r) => isUnitedStates(r.country));

  return {
    generatedAt: new Date().toISOString(),
    dateRange: { min: minDate, max: maxDate },
    totals: {
      catchAll: catchAll.length,
      allRecords: allRecords.length,
    },
    kpi: {
      today: todayCount,
      yesterday: yesterdayCount,
      thisWeek: thisWeekCount,
      prevWeek: prevWeekCount,
      wowChangePct,
      avgDaily30,
      avgWeekly30,
    },
    daily,
    weekly,
    weeklyLeaders,
    breakdowns: {
      countries: countBy(catchAll, (r) => r.country).slice(0, 15),
      employeeBands: countBy(catchAll, (r) => r.employeeBand),
      employeeMicroSegments: countBy(catchAll, (r) => r.employeeMicroSegment).map((x) => ({
        name: segmentLabel(x.name),
        key: x.name,
        count: x.count,
      })),
      usStates: countBy(usRows, (r) => r.state)
        .filter((s) => s.name !== '(empty)')
        .slice(0, 15),
      formPages: countBy(catchAll, (r) => r.formPage).slice(0, 10),
      statuses: countBy(catchAll, (r) => r.status).slice(0, 8),
    },
    insights: buildRichInsights(catchAll),
    insights24h: {
      windowHours: 24,
      windowStart: new Date(Date.now() - 86400000).toISOString(),
      windowEnd: new Date().toISOString(),
      insights: buildRichInsights(catchAll, { hours: 24 }),
    },
  };
}

function main() {
  const all = readJsonl(RECORDS_PATH);
  const catchOnly = all.filter((r) => isCatchAll(r.routingRuleMatched) || r.isCatchAll);
  const aggregates = buildAggregates(all);
  aggregates.totals.catchAll = catchOnly.length;

  fs.writeFileSync(AGGREGATES_PATH, JSON.stringify(aggregates, null, 2));

  let meta = {};
  if (fs.existsSync(META_PATH)) {
    meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
  }
  meta.aggregatesBuiltAt = aggregates.generatedAt;
  meta.recordCount = all.length;
  meta.catchAllCount = catchOnly.length;
  fs.writeFileSync(META_PATH, JSON.stringify(meta, null, 2));

  console.log(`Built aggregates: ${catchOnly.length} catch-all / ${all.length} total`);
  console.log(`  ${aggregates.weekly.length} weeks, ${aggregates.insights.length} insights`);
}

if (process.argv[1]?.includes('build-aggregates')) {
  main();
}
