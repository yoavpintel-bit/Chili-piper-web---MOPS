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

Open the site locally (required — **not published** on GitHub Pages):

```bash
npm start
# → http://localhost:3000  (main portal)
# → http://localhost:3000/mql-drilldown.html  (MQL cohort dashboard)
```

## Data pipeline

1. **`scripts/sync-from-csv.mjs`** — Imports Concierge export CSVs (`Routing Rule Matched = Catch All`).
2. **`scripts/sync-from-api.mjs`** — Incremental/full sync via Chili Piper Fire Edge API (`POST` concierge logs, 30-day windows).
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
| `CHILI_PIPER_API_KEY` or `CHILI_PIPER_TOKEN` | API auth for `sync:api` (Command Center → Integrations → API Access Tokens) |
| `CHILI_PIPER_API_BASE` | Optional; defaults to `https://fire.chilipiper.com` |
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

## Hosting (local only)

The portal is **not** served from `public/` on GitHub Pages. The live URL shows a short offline notice only ([`site-offline/`](site-offline/)).

To run locally: `npm start` after `npm run publish` (or `npm run sync`).

Optional: **Settings → Pages → Unpublish site** in GitHub to remove the `github.io` URL entirely.

## GitHub Actions & daily sync

1. Push this repo to GitHub (`main` branch).
2. Add repository secret **`CHILI_PIPER_API_KEY`** (Command Center → Integrations → Credentials → API Access Tokens) for [daily-sync.yml](.github/workflows/daily-sync.yml).
3. Daily sync updates `data/` and `public/data/` in the repo; it does **not** publish the full portal to the web.

### Daily sync (09:00 Israel time)

Workflow: [`.github/workflows/daily-sync.yml`](.github/workflows/daily-sync.yml)

| Step | What |
|------|------|
| **Concierge logs** | Last 7 days of Catch-All via Chili Piper API → `records.jsonl` |
| **Router teams** | Rebuild from `data/router_teams/raw/` (refresh locally via MCP or paste exports) |
| **Aggregates** | KPIs + insights → dashboard |
| **Publish** | Copy to `public/data/` and push → Pages redeploys |

Schedule: **06:00 UTC** = **09:00 Israel (IDT, summer)**. In winter (IST) runs at 08:00 local.

Manual run: **Actions → Daily prod sync → Run workflow**.

Optional secrets: `WORKATO_CSV_PATH` / `WORKATO_JSON_PATH` if Workato export is available on the runner.

### Authoritative documents (reference links on Home)

- [Inbound routing spreadsheet](https://docs.google.com/spreadsheets/d/1sUUDp7n0uwrYDKZZMmBwVNe2-8sQEwzEKMWW47IgYFk/edit?gid=837037962#gid=837037962)
- [Handoff spreadsheet](https://docs.google.com/spreadsheets/d/197PLS_Im3xKQn1-v4uCeGYdj04648_AxC4snN1ZE4u4/edit?gid=1309113080#gid=1309113080)
- [Full Chili logic doc](https://docs.google.com/document/d/1Suq33IhURUZJr1GNPZKQpAo8RlrWK60M42rz0ZCepmc/edit)

Deep links: `?tab=home` (default) · `?tab=operations&days=7` · `?tab=teams`

### MQL cohort dashboard (Marketing & Sales)

Single-page view of the MQL drilldown matched to Concierge routing logs:

```bash
npx serve public
# → http://localhost:3000/mql-drilldown.html
```

Rebuild from drilldown + Concierge exports, then publish:

```bash
npm run build:mql-drilldown
npm run publish
```

## Workato

Workato adds recent Catch-All rows. When you have a stable export path:

```bash
WORKATO_CSV_PATH=/path/to/workato.csv npm run merge:workato
npm run build:aggregates && node scripts/publish-data.mjs
```

## Logic document

Source of truth: `Chili Piper - Logic.docx`. Scenario content lives in `public/index.html`; future optional export to `docs/logic/`.
