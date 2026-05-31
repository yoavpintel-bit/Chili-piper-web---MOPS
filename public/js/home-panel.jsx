/* global React */

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const PORTAL_TABS = [
  { id: 'process', icon: '📖', label: 'Interactive Story', desc: 'Scroll-through lead journey with a live visual simulator for each pipeline stage.' },
  { id: 'blueprint', icon: '🗺️', label: 'Visual Blueprint Map', desc: 'Clickable Concierge → Marketo → Distro flowchart with business, technical, and hybrid views.' },
  { id: 'simulator', icon: '🧪', label: 'Scenario Playground', desc: 'Step-by-step routing game — answer each question and watch what happens at every stage.' },
  { id: 'playbook', icon: '📋', label: 'Technical Playbook', desc: 'Scenarios A–I reference cards, module comparison matrix, and routing guardrails.' },
  { id: 'teams', icon: '🌍', label: 'Teams & Countries', desc: 'Inbound router by region — segment rules and team rosters (column I).' },
  { id: 'operations', icon: '📊', label: 'Catch-All Dashboard', desc: 'Catch-All KPIs, trends, MOPS review queue, and Scenario F monitoring.' },
  { id: 'fields', icon: '🔑', label: 'Field Mappings', desc: 'API field dictionary: enrichment variables, Chili Piper event fields, and Salesforce destinations.' },
];

const SOURCE_LINKS = [
  {
    title: 'Inbound routing spreadsheet',
    desc: 'Live Concierge / inbound segment rules, queues, and territory logic.',
    href: 'https://docs.google.com/spreadsheets/d/1sUUDp7n0uwrYDKZZMmBwVNe2-8sQEwzEKMWW47IgYFk/edit?gid=837037962#gid=837037962',
    tag: 'Google Sheets',
    icon: '📗',
  },
  {
    title: 'Handoff spreadsheet',
    desc: 'SDR → AE pod pairings and Handoff module calendar mappings.',
    href: 'https://docs.google.com/spreadsheets/d/197PLS_Im3xKQn1-v4uCeGYdj04648_AxC4snN1ZE4u4/edit?gid=1309113080#gid=1309113080',
    tag: 'Google Sheets',
    icon: '📘',
  },
  {
    title: 'Full Chili Piper logic document',
    desc: 'Authoritative RevOps write-up of routing rules, scenarios, and module behavior.',
    href: 'https://docs.google.com/document/d/1Suq33IhURUZJr1GNPZKQpAo8RlrWK60M42rz0ZCepmc/edit?tab=t.0#heading=h.fwrm0rmjb9tr',
    tag: 'Google Doc',
    icon: '📄',
  },
];

const DATA_PIPELINE = [
  { title: 'Chili Piper API & MCP', desc: 'Catch-All dashboard syncs Concierge exports where Routing Rule Matched = Catch All.', icon: '🌶️' },
  { title: 'CSV exports', desc: 'Manual Concierge CSV drops feed sync-from-csv.mjs when API access is unavailable.', icon: '📁' },
  { title: 'Workato (optional)', desc: 'Daily Catch-All export merge via WORKATO_CSV_PATH when automation exists.', icon: '⚡' },
  { title: 'Router teams build', desc: 'Teams & Countries tab from Chili Piper rules export (MCP cache or data/router_teams/raw/).', icon: '👥' },
];

const MODULE_GLOSSARY = [
  { id: 'concierge', name: 'Concierge', emoji: '📅', accent: 'text-orange-700 bg-orange-50 border-orange-200', summary: 'Live on-page scheduling for qualified inbound handraisers (typically 20–8,000 employees). Runs spam, QA, ownership, and segment rules before showing a calendar.' },
  { id: 'distro', name: 'Distro', emoji: '⚙️', accent: 'text-indigo-700 bg-indigo-50 border-indigo-200', summary: 'Silent backend assignment when a lead does not book live. Strict round-robin by region, state, and size after Marketo MQL and RingLead pass.' },
  { id: 'handoff', name: 'Handoff', emoji: '🤝', accent: 'text-teal-700 bg-teal-50 border-teal-200', summary: 'Post-discovery SDR → AE scheduling inside Salesforce via the Chili Piper Chrome extension. Routes by sales Pod, not geography.' },
  { id: 'enrichment', name: 'Enrichment', emoji: '🔍', accent: 'text-cyan-700 bg-cyan-50 border-cyan-200', summary: 'Firmographic lookup (ZoomInfo today; Clay planned) for HQ country, state, and employee count. Manual form fill is the lowest-priority fallback.' },
  { id: 'catch-all', name: 'Catch-All', emoji: '⊘', accent: 'text-[#E2004F] bg-[#FFF0F3] border-[#FFD2DB]', summary: 'Safety net when Concierge or Distro cannot match an active segment rule. No live calendar; MOPS reviews and assigns manually.' },
  { id: 'marketo', name: 'Marketo', emoji: '📣', accent: 'text-purple-700 bg-purple-50 border-purple-200', summary: 'Universal lead log — every submission flows here for scoring, dedupe, and MQL conversion before Salesforce sync.' },
  { id: 'ringlead', name: 'RingLead', emoji: '🔗', accent: 'text-blue-800 bg-blue-50 border-blue-200', summary: 'Salesforce deduplication gate. Failed matches block Distro and leave accounts on the MOPS monitoring list.' },
  { id: 'zoominfo', name: 'ZoomInfo', emoji: '🏢', accent: 'text-[#007C92] bg-cyan-50 border-cyan-200', summary: 'Real-time domain API on email focus-out. Populates cb_company_employees__c, country, and state fields used by Chili Piper routers.' },
];

const HERO_STATS = [
  { value: '7', label: 'Pipeline stages' },
  { value: 'A–I', label: 'Routing scenarios' },
  { value: '20–8K', label: 'Live booking band' },
  { value: 'Live', label: 'Catch-All data' },
];

function SourceCard({ title, desc, href, tag, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white border border-[#EBE5D9] rounded-2xl p-5 hover:border-[#E2004F] hover:shadow-lg transition-all text-left h-full"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
          {tag}
        </span>
      </div>
      <h4 className="text-base font-extrabold text-[#222121] group-hover:text-[#E2004F] transition-colors">{title}</h4>
      <p className="text-sm text-slate-600 mt-2 leading-relaxed flex-1">{desc}</p>
      <span className="text-xs font-bold text-[#E2004F] mt-4 inline-flex items-center gap-1.5">
        Open source <ExternalLinkIcon />
      </span>
    </a>
  );
}

function SectionHeader({ badge, title, subtitle }) {
  return (
    <div className="mb-6">
      {badge && (
        <span className="text-[11px] font-extrabold text-[#E2004F] uppercase tracking-wider bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FFD2DB]">
          {badge}
        </span>
      )}
      <h2 className="text-xl md:text-2xl font-extrabold text-[#222121] mt-3 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">{subtitle}</p>}
    </div>
  );
}

function HomePanel({ onNavigateTab }) {
  const go = (tabId, extra) => {
    if (typeof onNavigateTab === 'function') onNavigateTab(tabId, extra);
  };

  return (
    <div className="space-y-12 animate-fadeIn text-left">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#EBE5D9] shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF0F3]" />
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#E2004F]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="relative px-6 md:px-10 py-10 md:py-12">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold text-[#E2004F] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#FFD2DB] shadow-sm">
              HiBob RevOps · Chili Piper Hub
            </span>
            <span className="text-[11px] font-medium text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-[#EBE5D9]">
              MQL Inbound · Router 7e9c794d
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222121] mt-5 tracking-tight leading-tight max-w-3xl">
            Lead routing documentation &amp; Catch-All operations
          </h1>
          <p className="text-base text-slate-600 mt-4 max-w-2xl leading-relaxed">
            One portal for how website handraisers move through enrichment, Chili Piper Concierge,
            Marketo, Salesforce, RingLead, and Distro — plus a live Catch-All dashboard for Marketing Operations.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="bg-white/90 backdrop-blur border border-[#EBE5D9] rounded-2xl px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-extrabold text-[#E2004F]">{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              type="button"
              onClick={() => go('process')}
              className="text-sm font-bold text-white bg-[#E2004F] px-5 py-2.5 rounded-xl hover:bg-[#c40044] shadow-md transition-colors"
            >
              Explore the journey →
            </button>
            <button
              type="button"
              onClick={() => go('operations', { days: 7 })}
              className="text-sm font-bold text-[#222121] bg-white border-2 border-[#EBE5D9] px-5 py-2.5 rounded-xl hover:border-[#E2004F] transition-colors"
            >
              Catch-All dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Catch-All */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
        <div className="lg:col-span-3 bg-gradient-to-br from-[#FFF0F3] to-white border-2 border-[#FFD2DB] rounded-3xl p-6 md:p-8 shadow-sm">
          <SectionHeader
            badge="Concept"
            title="What is Catch-All?"
            subtitle="The safety net when automated routing cannot assign a rep."
          />
          <p className="text-sm text-slate-700 leading-relaxed">
            Catch-All is <strong>not</strong> a Chili Piper product module — it is the fallback bucket when Concierge segment rules
            (region, state, employee band) or Distro backend rules find no match, or when enrichment is too thin to route confidently.
            These accounts stay unassigned until MOPS reviews them in the dashboard (Scenario F) or daily monitoring lists.
          </p>
          <button
            type="button"
            onClick={() => go('operations', { days: 7 })}
            className="mt-6 text-sm font-bold text-white bg-[#E2004F] px-5 py-2.5 rounded-xl hover:bg-[#c40044] transition-colors inline-flex items-center gap-2"
          >
            <span>⊘</span> Open Catch-All dashboard →
          </button>
        </div>
        <div className="lg:col-span-2 bg-[#222121] text-white rounded-3xl p-6 md:p-8 flex flex-col justify-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#FFB3C7]">When leads land here</p>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {[
              'No matching Concierge segment rule',
              'Distro rule gap after abandon',
              'Thin or failed enrichment',
              'RingLead dedupe blocks assignment',
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[#E2004F] font-bold">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Enrichment */}
      <section className="bg-white border border-[#EBE5D9] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-2xl shrink-0">
            🔍
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold text-[#222121]">What is enrichment?</h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-3xl">
              Enrichment attaches <strong>firmographic telemetry</strong> to a form submission before routing decisions run.
              On HiBob&apos;s site, the business email domain triggers a ZoomInfo lookup for HQ country, state, and employee count.
              Those values populate Chili Piper payload fields (e.g.{' '}
              <code className="text-xs bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EBE5D9]">cb_company_employees__c</code>
              ) that drive the 20–8,000 live-booking window and regional segment rules.
            </p>
            <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-3xl">
              If enrichment fails, a second manual step captures title, company, and headcount. Marketo may run a secondary pass;
              Salesforce account data can override fresh enrichment when an account already exists.
            </p>
          </div>
        </div>
      </section>

      {/* Module glossary */}
      <section>
        <SectionHeader
          badge="Glossary"
          title="Module glossary"
          subtitle="Concierge, Distro, Handoff, and the systems they connect to."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULE_GLOSSARY.map((mod) => (
            <div key={mod.id} className={`border rounded-2xl p-5 hover:shadow-md transition-shadow ${mod.accent}`}>
              <span className="text-2xl">{mod.emoji}</span>
              <h3 className="text-base font-extrabold mt-3">{mod.name}</h3>
              <p className="text-sm mt-2 leading-relaxed opacity-95">{mod.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore portal */}
      <section>
        <SectionHeader
          badge="Navigation"
          title="Explore the portal"
          subtitle="Each tab covers a different lens on the same inbound routing architecture."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTAL_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => go(tab.id, tab.id === 'operations' ? { days: 7 } : undefined)}
              className="text-left bg-white border border-[#EBE5D9] rounded-2xl p-5 hover:border-[#E2004F] hover:shadow-md transition-all group"
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className="block text-sm font-extrabold text-[#222121] mt-3 group-hover:text-[#E2004F] transition-colors">
                {tab.label}
              </span>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{tab.desc}</p>
              <span className="text-xs font-bold text-[#E2004F] mt-3 inline-block opacity-70 group-hover:opacity-100 transition-opacity">
                Open tab →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Authoritative sources */}
      <section>
        <SectionHeader
          badge="Sources"
          title="Authoritative sources"
          subtitle="Spreadsheets and the logic doc are the system-of-record for rules. Links open in a new tab."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SOURCE_LINKS.map((src) => (
            <SourceCard key={src.href} {...src} />
          ))}
        </div>
      </section>

      {/* Data pipeline */}
      <section className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-3xl p-6 md:p-8">
        <SectionHeader
          title="Data behind this site"
          subtitle={
            <>
              Static JSON in{' '}
              <code className="text-xs bg-white px-1.5 py-0.5 rounded border border-[#EBE5D9]">public/data/</code>
              {' '}is rebuilt by npm scripts — see README for sync commands.
            </>
          }
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATA_PIPELINE.map((item) => (
            <li key={item.title} className="flex gap-4 bg-white border border-[#EBE5D9] rounded-2xl p-5">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <span className="font-extrabold text-[#222121] block text-sm">{item.title}</span>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

window.HomePanel = HomePanel;
