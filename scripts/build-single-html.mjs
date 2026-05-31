#!/usr/bin/env node
/**
 * Builds one self-contained index.html for GitHub Pages (single-file repo).
 * Output: public/index-standalone.html — copy contents to your repo's index.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pub = path.join(root, 'public');

const JSX_ORDER = [
  'js/home-panel.jsx',
  'js/operations-panel.jsx',
  'js/teams-countries-panel.jsx',
  'js/journey-visuals.jsx',
  'js/blueprint-panel.jsx',
  'js/app.jsx',
];

function read(p) {
  return fs.readFileSync(path.join(pub, p), 'utf8');
}

function escapeScriptClose(s) {
  return s.replace(/<\/script/gi, '<\\/script');
}

const recordsJsonl = read('data/catch_all/records.jsonl');
const portalData = {
  catchAll: {
    aggregates: JSON.parse(read('data/catch_all/aggregates.json')),
    meta: JSON.parse(read('data/catch_all/meta.json')),
    recordsJsonl,
  },
  routerTeams: JSON.parse(read('data/router_teams/inbound-router-live.json')),
};

const jsxBlocks = JSX_ORDER.map((rel) => {
  const src = read(rel);
  return `<script type="text/babel" data-presets="react,env">\n${escapeScriptClose(src)}\n</script>`;
}).join('\n\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    (function () {
      var loc = window.location;
      if (!loc.hostname.endsWith('github.io')) return;
      var parts = loc.pathname.split('/').filter(Boolean);
      if (!parts.length || /\.html$/i.test(parts[0])) return;
      var base = document.createElement('base');
      base.href = loc.origin + '/' + parts[0] + '/';
      document.head.appendChild(base);
    })();
  </script>
  <title>HiBob RevOps Chili Piper Lead Routing Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #FFFDF9; }
    .custom-scroll::-webkit-scrollbar-thumb { background-color: #EBE5D9; border-radius: 10px; }
    .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
    .animate-scaleUp { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleUp { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes journeyPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(226, 0, 79, 0.25); } 50% { box-shadow: 0 0 0 6px rgba(226, 0, 79, 0); } }
    @keyframes journeyFlow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes journeyStaggerIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .journey-pulse { animation: journeyPulse 2s ease-in-out infinite; }
    .journey-flow-line { background: linear-gradient(90deg, #a5f3fc, #E2004F, #34d399, #a5f3fc); background-size: 200% 100%; animation: journeyFlow 2.5s linear infinite; }
    .journey-stagger { animation: journeyStaggerIn 0.35s ease-out forwards; }
  </style>
</head>
<body class="bg-[#FFFDF9] text-[#222121] font-sans antialiased p-2">
  <div id="root"></div>
  <script>
    window.__PORTAL_DATA__ = ${JSON.stringify(portalData)};
  </script>
${jsxBlocks}
  <script>
    (function bootPortal() {
      var rootEl = document.getElementById('root');
      function showError(msg) {
        if (!rootEl) return;
        rootEl.innerHTML = '<div style="padding:2.5rem;font-family:system-ui;max-width:32rem;margin:0 auto">' +
          '<h2 style="color:#E2004F;font-weight:800">Portal did not load</h2>' +
          '<p style="color:#5A5755;margin-top:0.5rem">' + msg + '</p></div>';
      }
      function mount() {
        if (!window.React || !window.ReactDOM || !window.App) return false;
        ReactDOM.createRoot(rootEl).render(React.createElement(window.App));
        return true;
      }
      function wait(attempt) {
        if (mount()) return;
        if (attempt > 200) { showError('Timed out. Hard-refresh (Cmd+Shift+R).'); return; }
        setTimeout(function () { wait(attempt + 1); }, 50);
      }
      if (typeof Babel !== 'undefined') {
        try { Babel.transformScriptTags(); } catch (e) { console.warn(e); }
      } else {
        showError('Babel failed to load.');
        return;
      }
      wait(0);
    })();
  </script>
</body>
</html>
`;

const outPath = path.join(pub, 'index-standalone.html');
fs.writeFileSync(outPath, html, 'utf8');
const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(`Wrote ${outPath} (${mb} MB)`);
console.log('Copy this file contents into GitHub repo index.html');
