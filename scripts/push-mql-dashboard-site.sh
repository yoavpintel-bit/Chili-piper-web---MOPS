#!/usr/bin/env bash
# Create GitHub repo (if gh is installed) and push mql-dashboard-web.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/mql-dashboard-web"
REPO_NAME="${MQL_DASHBOARD_REPO:-hibob-mql-routing-dashboard}"
GITHUB_USER="${GITHUB_USER:-yoavpintel-bit}"

cd "$ROOT"
npm run build:mql-drilldown 2>/dev/null || node scripts/build-mql-drilldown-report.mjs
mkdir -p "$SITE/public/data/mql_drilldown" "$SITE/public/js"
cp public/js/mql-drilldown-dashboard.jsx "$SITE/public/js/"
cp public/data/mql_drilldown/report.json "$SITE/public/data/mql_drilldown/"
cp public/data/mql_drilldown/report.csv "$SITE/public/data/mql_drilldown/"
cp public/mql-drilldown.html "$SITE/public/index.html"

cd "$SITE"
if [[ ! -d .git ]]; then
  git init -b main
  git add .
  git commit -m "Initial MQL routing dashboard for GitHub Pages"
fi

REMOTE="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

if command -v gh >/dev/null 2>&1; then
  if ! git remote get-url origin >/dev/null 2>&1; then
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push --description "MQL cohort Chili Piper routing dashboard"
  else
    git push -u origin main
  fi
  echo ""
  echo "Enable Pages: repo Settings → Pages → Build: GitHub Actions (workflow included)."
  gh repo view --web 2>/dev/null || true
else
  echo "gh CLI not found. Create an empty repo on GitHub named: $REPO_NAME"
  echo "Then run:"
  echo "  cd \"$SITE\""
  echo "  git remote add origin $REMOTE   # skip if origin exists"
  echo "  git push -u origin main"
  echo ""
  echo "Enable GitHub Pages: Settings → Pages → Source: GitHub Actions"
fi
