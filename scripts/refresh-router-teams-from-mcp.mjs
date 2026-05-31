#!/usr/bin/env node
/**
 * Refresh router teams raw cache from Chili Piper MCP exports saved under agent-tools/.
 * Run MCP tools first (or paste JSON into data/router_teams/raw/):
 *   - rule-list (workspaceId filter, pageSize 500)
 *   - team-list (workspaceIds)
 *   - concierge-list-routers (workspaceId)
 *   - workspace-list-users (workspaceId)
 *
 * Or set env paths:
 *   ROUTER_TEAMS_RULES_FILE, ROUTER_TEAMS_TEAMS_FILE, ROUTER_TEAMS_ROUTER_FILE, ROUTER_TEAMS_USERS_FILE
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const build = spawnSync('node', ['scripts/build-router-teams.mjs'], {
  cwd: ROOT,
  stdio: 'inherit',
});
if (build.status !== 0) process.exit(build.status || 1);

const publish = spawnSync('node', ['scripts/publish-data.mjs'], {
  cwd: ROOT,
  stdio: 'inherit',
});
process.exit(publish.status ?? 0);
