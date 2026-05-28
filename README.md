# HiBob RevOps — Chili Piper Lead Routing Hub

Single source for **Chili Piper routing logic documentation** and a live **Concierge Catch-All operations dashboard** (Scenario F).

## What's included

| Area | Description |
|------|-------------|
| **Home** | Landing page: portal overview, authoritative Google sources, module glossary, Catch-All & enrichment explainers |
| **Interactive Story** | Scroll-through lead journey with live visual simulator |
| **Visual Blueprint** | Concierge → Marketo → Distro map |
| **Scenario Playground** | What-if routing simulator |
| **Technical Playbook** | Scenarios A–H + module comparison |
| **Operations** | Catch-All KPIs, trends, insights, MOPS review queue |
| **Teams & Countries** | Inbound router rules → teams, countries, size bands, members |

## Quick start (local)

```bash
cd "Chili piper"
npm run sync          # CSV from ~/Downloads (or API if key set)
```

Open the site (requires a local server so `fetch` works):

```bash
npx serve public
# → http://localhost:3000
```

## Data pipeline

1. **`scripts/sync-from-csv.mjs`** — Imports Concierge export CSVs (`Routing Rule Matched = Catch All`).
2. **`scripts/sync-from-api.mjs`** — Incremental/full sync via Chili Piper API (30-day windows).
3. **`scripts/sync-from-mcp-file.mjs`** — Import JSON saved from Cursor MCP `concierge-logs`.
4. **`scripts/build-aggregates.mjs`** — KPIs, daily buckets, insights.
5. **`scripts/publish-data.mjs`** — Copies JSON into `public/data/catch_all/` for the static site.
6. **`scripts/build-router-teams.mjs`** — Builds inbound router rules/teams JSON from MCP exports.
7. **`scripts/merge-workato.mjs`** — Optional merge when `WORKATO_CSV_PATH` is set.

Output files:

- `data/catch_all/records.jsonl`
- `data/catch_all/aggregates.json`
- `data/catch_all/meta.json`

Router config: [`data/catch_all/config.json`](data/catch_all/config.json) (MQL Inbound main router).

### Teams & Countries (router rules)

Refresh from Chili Piper MCP cache files (rules, teams, router) or copies under `data/router_teams/raw/`:

```bash
npm run build:router-teams
# optional: ROUTER_TEAMS_RULES_FILE=... ROUTER_TEAMS_TEAMS_FILE=... ROUTER_TEAMS_ROUTER_FILE=...
node scripts/publish-data.mjs
```

Output: `data/router_teams/inbound-router-live.json` → `public/data/router_teams/inbound-router-live.json`

Deep link: `?tab=teams`

### Environment variables

| Variable | Purpose |
|----------|---------|
| `CSV_PATHS` | Semicolon-separated CSV paths for `sync:csv` |
| `CHILI_PIPER_API_KEY` or `CHILI_PIPER_TOKEN` | API auth for `sync:api` |
| `SYNC_FULL_BACKFILL=1` | Pull ~180 days in 30-day windows |
| `SYNC_INCREMENTAL_DAYS=3` | Days to refresh on daily run |
| `WORKATO_CSV_PATH` | Workato daily Catch-All export for merge |

### MCP backfill (6 months)

`concierge-logs` allows max **30 days** per call. Example windows for router `7e9c794d-b6db-40ec-ae07-f363d77b5f36`:

```bash
# Save each MCP response to data/catch_all/raw/mcp-window-N.json, then:
node scripts/sync-from-mcp-file.mjs data/catch_all/raw/mcp-window-*.json
npm run build:aggregates && node scripts/publish-data.mjs
```

Initial dataset was seeded from Concierge CSV exports (~3,680 Catch-All rows, Jan–May 2026).

## GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment**: GitHub Actions.
3. Add secret **`CHILI_PIPER_API_KEY`** (or `CHILI_PIPER_TOKEN`) for [daily-sync.yml](.github/workflows/daily-sync.yml).
4. Site root: `/public` (deployed by [pages.yml](.github/workflows/pages.yml)).

Deep links: `?tab=home` (default) · `?tab=operations&days=7` · `?tab=teams`

## Workato

Workato adds recent Catch-All rows. When you have a stable export path:

```bash
WORKATO_CSV_PATH=/path/to/workato.csv npm run merge:workato
npm run build:aggregates && node scripts/publish-data.mjs
```

## Logic document

Source of truth: `Chili Piper - Logic.docx`. Scenario content lives in `public/index.html`; future optional export to `docs/logic/`.
