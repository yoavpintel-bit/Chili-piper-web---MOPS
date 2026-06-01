/* global React */
const { useState, useEffect } = React;

const EXPLORE_LINKS = [
  { id: 'process', icon: '📖', label: 'Follow the lead journey', technical: 'Interactive Story', desc: 'See each step from form submit to rep assignment.' },
  { id: 'blueprint', icon: '🗺️', label: 'See how routing works', technical: 'Visual Blueprint', desc: 'Map of the full path — switch to technical view inside.' },
  { id: 'simulator', icon: '🧪', label: 'Try it yourself', technical: 'Scenario Playground', desc: 'Answer questions and watch what happens to a sample lead.' },
  { id: 'playbook', icon: '📋', label: 'What can happen to a lead', technical: 'Technical Playbook', desc: 'Nine outcomes (A–I), tools compared, and routing rules.' },
  { id: 'teams', icon: '🌍', label: 'Who covers which region', technical: 'Teams & Countries', desc: 'Sales teams and countries by inbound segment.' },
  { id: 'operations', icon: '📊', label: 'Leads we could not auto-assign', technical: 'Catch-All Dashboard', desc: 'Monitor and review leads that did not match a rule.', extra: { days: 7 } },
  { id: 'fields', icon: '🔑', label: 'Which data fields are used', technical: 'Field Mappings', desc: 'Field names for integrations and Salesforce.' },
];

const OVERVIEW = [
  {
    id: 'journey',
    icon: '🚀',
    title: 'What happens after someone fills out a form?',
    simple: 'We check company size and location, try to book a meeting on the website, log the lead in marketing, sync to Salesforce, and assign a rep if they do not book.',
    technical: 'Handraiser → ZoomInfo enrichment → Concierge (20–8K employees) → parallel Marketo + SFDC → RingLead dedupe → Distro if calendar abandoned → Catch-All if no rule matches.',
  },
  {
    id: 'booking',
    icon: '📅',
    title: 'When does someone get a meeting on the website?',
    simple: 'Usually when the company has about 20–8,000 employees and matches our regional rules. Smaller or larger companies, or no matching rule, follow other paths.',
    technical: 'Concierge Flexible RR; meeting type Disco Call only; ownership bypass when SFDC owner on CP Ownership team; Scenario A = booked, B/C = abandon or backend assign.',
  },
  {
    id: 'catchall',
    icon: '⊘',
    title: 'What if we cannot assign anyone automatically?',
    simple: 'The lead goes to a Catch-All list for Marketing Operations to review and assign manually. This is normal when rules or data do not fit a segment.',
    technical: 'Scenario F — routingRuleMatched = Catch All; no Concierge calendar; continues in Marketo; MOPS dashboard tracks volume and patterns.',
  },
];

const SOURCE_LINKS = [
  { title: 'Inbound routing spreadsheet', href: 'https://docs.google.com/spreadsheets/d/1sUUDp7n0uwrYDKZZMmBwVNe2-8sQEwzEKMWW47IgYFk/edit?gid=837037962#gid=837037962', tag: 'Sheets' },
  { title: 'Handoff spreadsheet', href: 'https://docs.google.com/spreadsheets/d/197PLS_Im3xKQn1-v4uCeGYdj04648_AxC4snN1ZE4u4/edit?gid=1309113080#gid=1309113080', tag: 'Sheets' },
  { title: 'Full routing logic document', href: 'https://docs.google.com/document/d/1Suq33IhURUZJr1GNPZKQpAo8RlrWK60M42rz0ZCepmc/edit?tab=t.0#heading=h.fwrm0rmjb9tr', tag: 'Doc' },
];

function MenuIcon({ open }) {
  return (
    <span className="flex flex-col justify-center gap-1.5 w-5 h-5" aria-hidden>
      <span className={`block h-0.5 bg-current rounded transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`block h-0.5 bg-current rounded transition-all ${open ? 'opacity-0' : ''}`} />
      <span className={`block h-0.5 bg-current rounded transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
    </span>
  );
}

function ExploreMenu({ open, onClose, onNavigate }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-label="Explore the portal">
      <button type="button" className="absolute inset-0 bg-[#222121]/40 backdrop-blur-sm" onClick={onClose} aria-label="Close menu" />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBE5D9] bg-[#FAF8F5]">
          <div>
            <h2 className="text-lg font-extrabold text-[#222121]">Explore</h2>
            <p className="text-xs text-slate-500 mt-0.5">Choose a topic to learn more</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#EBE5D9]" aria-label="Close">
            <MenuIcon open />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
          {EXPLORE_LINKS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => { onNavigate(item.id, item.extra); onClose(); }}
                className="w-full text-left p-4 rounded-2xl border border-[#EBE5D9] hover:border-[#E2004F] hover:bg-[#FFF0F3]/40 transition-all group"
              >
                <div className="flex gap-3">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-[#222121] group-hover:text-[#E2004F]">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.technical}</p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-[#EBE5D9] bg-[#FAF8F5]">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Inside each section you can open <strong>technical details</strong> (field names, scenarios, API views).
          </p>
        </div>
      </div>
    </div>
  );
}

function TechnicalToggle({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-[11px] font-bold text-[#E2004F] hover:underline inline-flex items-center gap-1"
      >
        {open ? 'Hide technical details' : 'Show technical details'}
        <span className="text-slate-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl px-3 py-2.5 font-mono">
          {children}
        </p>
      )}
    </div>
  );
}

function OverviewCard({ icon, title, simple, technical }) {
  return (
    <article className="bg-white border border-[#EBE5D9] rounded-2xl p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-[#222121] leading-snug">{title}</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">{simple}</p>
          <TechnicalToggle>{technical}</TechnicalToggle>
        </div>
      </div>
    </article>
  );
}

function HomePanel({ onNavigateTab }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (tabId, extra) => {
    if (typeof onNavigateTab === 'function') onNavigateTab(tabId, extra);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn text-left pb-8">
      <ExploreMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} />

      {/* Hero overview */}
      <section className="text-center pt-2">
        <span className="text-[10px] font-extrabold text-[#E2004F] uppercase tracking-wider bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FFD2DB]">
          HiBob inbound leads
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#222121] mt-4 tracking-tight leading-tight">
          How website leads get a sales rep
        </h1>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-lg mx-auto">
          A short overview of booking, assignment, and what to do when automation cannot place a lead.
        </p>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#222121] text-white font-bold text-sm shadow-lg hover:bg-[#333] transition-colors"
        >
          <MenuIcon open={false} />
          <span>Explore all topics</span>
        </button>
        <p className="text-[10px] text-slate-400 mt-2">Journey · Map · Practice · Teams · Catch-All · more</p>
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { v: '7', l: 'Main steps' },
          { v: 'A–I', l: 'Possible outcomes' },
          { v: '20–8K', l: 'Live booking size' },
          { v: 'Daily', l: 'Catch-All data' },
        ].map((s) => (
          <div key={s.l} className="bg-white border border-[#EBE5D9] rounded-xl py-3 px-2 text-center">
            <p className="text-lg font-extrabold text-[#E2004F]">{s.v}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Overview cards */}
      <section className="space-y-3">
        <h2 className="text-sm font-extrabold text-[#222121] uppercase tracking-wider text-center">At a glance</h2>
        {OVERVIEW.map((item) => (
          <OverviewCard key={item.id} {...item} />
        ))}
      </section>

      {/* Two quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => go('process')}
          className="p-4 rounded-2xl border-2 border-[#E2004F] bg-[#FFF0F3] text-left hover:shadow-md transition-shadow"
        >
          <span className="text-xl">📖</span>
          <p className="text-sm font-extrabold text-[#222121] mt-2">Start the step-by-step journey</p>
          <p className="text-xs text-slate-600 mt-1">Best for first-time readers</p>
        </button>
        <button
          type="button"
          onClick={() => go('operations', { days: 7 })}
          className="p-4 rounded-2xl border border-[#EBE5D9] bg-white text-left hover:border-[#E2004F] hover:shadow-md transition-all"
        >
          <span className="text-xl">📊</span>
          <p className="text-sm font-extrabold text-[#222121] mt-2">Open unassigned leads dashboard</p>
          <p className="text-xs text-slate-600 mt-1">For MOPS &amp; RevOps review</p>
        </button>
      </div>

      {/* Reference docs — collapsed */}
      <details className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-4">
        <summary className="text-sm font-extrabold text-[#222121] cursor-pointer list-none flex items-center justify-between">
          Official spreadsheets &amp; documents
          <span className="text-slate-400 text-xs font-normal">Optional</span>
        </summary>
        <ul className="mt-3 space-y-2">
          {SOURCE_LINKS.map((src) => (
            <li key={src.href}>
              <a
                href={src.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E2004F] hover:underline flex items-center justify-between gap-2 py-1"
              >
                <span>{src.title}</span>
                <span className="text-[10px] text-slate-400 font-normal">{src.tag} ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </details>

      {/* Sticky explore on mobile */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-40">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#222121] text-white font-bold text-sm shadow-xl"
        >
          <MenuIcon open={false} />
          Explore all topics
        </button>
      </div>
    </div>
  );
}

window.HomePanel = HomePanel;
window.HOME_EXPLORE_LINKS = EXPLORE_LINKS;
