/* global React */
const { useMemo } = React;

// —— System icons (inline SVG, HiBob palette) ——
const BobIcon = () => (
  <svg className="w-3 h-3 text-[#E2004F] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const ChiliPiperIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#FF4500] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C11.5 2 11 2.5 11 3C11 4.5 9.5 5.5 8 5.5C7.5 5.5 7 6 7 6.5C7 7.5 5.5 8.5 4 8.5C3.5 8.5 3 9 3 9.5C3 11 4.5 12 5.5 13.5C5.5 14 5 14.5 5 15C5 18.5 9 22 13 22C17 22 21 18.5 21 15C21 11.5 19 8.5 16 7C14.5 6 13.5 4.5 13 3C13 2.5 12.5 2 12 2Z" />
  </svg>
);
const SalesforceIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#00A1E0] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" />
  </svg>
);
const MarketoIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#5C2D91] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" />
  </svg>
);
const ZoomInfoIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#007C92] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);
const RingLeadIcon = () => (
  <svg className="w-3.5 h-3.5 text-[#004A8F] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const SYSTEM_META = {
  website: { label: 'Website', icon: <BobIcon />, pill: 'bg-[#FFF0F3] text-[#E2004F] border-[#FFD2DB]' },
  zoominfo: { label: 'ZoomInfo', icon: <ZoomInfoIcon />, pill: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  second_form: { label: '2nd Form', icon: <BobIcon />, pill: 'bg-[#FFF0F3] text-[#E2004F] border-[#FFD2DB]' },
  concierge: { label: 'Concierge', icon: <ChiliPiperIcon />, pill: 'bg-orange-50 text-orange-800 border-orange-200' },
  marketo: { label: 'Marketo', icon: <MarketoIcon />, pill: 'bg-purple-50 text-purple-800 border-purple-200' },
  salesforce: { label: 'Salesforce', icon: <SalesforceIcon />, pill: 'bg-blue-50 text-blue-800 border-blue-200' },
  ringlead: { label: 'RingLead', icon: <RingLeadIcon />, pill: 'bg-teal-50 text-teal-800 border-teal-200' },
  distro: { label: 'Distro', icon: <ChiliPiperIcon />, pill: 'bg-orange-50 text-orange-800 border-orange-200' },
  handoff: { label: 'Handoff', icon: <ChiliPiperIcon />, pill: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

const SCENARIO_OUTCOME = {
  A: { type: 'success', label: 'Gold path', emoji: '✓' },
  B: { type: 'warning', label: 'Abandoned UI', emoji: '⏸' },
  C: { type: 'backend', label: 'Backend only', emoji: '⚙' },
  D: { type: 'warning', label: 'Fallback form', emoji: '?' },
  E: { type: 'success', label: 'Owner match', emoji: '👤' },
  F: { type: 'catch-all', label: 'Catch-All', emoji: '⊘' },
  G: { type: 'warning', label: 'Dedupe block', emoji: '✕' },
  H: { type: 'catch-all', label: 'Distro gap', emoji: '⊘' },
  I: { type: 'success', label: 'Pod handoff', emoji: '🤝' },
};

const OUTCOME_STYLES = {
  success: {
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    node: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    arrow: 'text-emerald-400',
  },
  warning: {
    border: 'border-l-amber-500',
    badge: 'bg-amber-100 text-amber-900 border-amber-200',
    node: 'bg-amber-50 border-amber-300 text-amber-900',
    arrow: 'text-amber-400',
  },
  'catch-all': {
    border: 'border-l-[#E2004F]',
    badge: 'bg-[#FFF0F3] text-[#E2004F] border-[#FFD2DB]',
    node: 'bg-[#FFF0F3] border-[#FFD2DB] text-[#E2004F]',
    arrow: 'text-[#E2004F]/50',
  },
  backend: {
    border: 'border-l-slate-500',
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    node: 'bg-slate-50 border-slate-300 text-slate-700',
    arrow: 'text-slate-400',
  },
};

function FlowArrow({ className = '' }) {
  return <span className={`text-[11px] font-black leading-none shrink-0 ${className}`} aria-hidden>→</span>;
}

function MiniFlowDiagram({ systems, outcomeType }) {
  const styles = OUTCOME_STYLES[outcomeType] || OUTCOME_STYLES.backend;
  const nodes = (systems || []).slice(0, 4);
  if (!nodes.length) return null;
  return (
    <div className="flex items-center justify-center gap-0.5 py-2 px-1 rounded-xl bg-white/80 border border-[#EBE5D9]/80" aria-hidden>
      {nodes.map((key, i) => {
        const meta = SYSTEM_META[key] || { label: key, icon: null };
        return (
          <React.Fragment key={`${key}-${i}`}>
            {i > 0 && <FlowArrow className={styles.arrow} />}
            <div
              className={`flex flex-col items-center min-w-[44px] max-w-[56px] px-1 py-1 rounded-lg border text-[7px] font-bold leading-tight text-center ${styles.node}`}
              title={meta.label}
            >
              <span className="mb-0.5 scale-90">{meta.icon}</span>
              <span className="w-full break-words leading-tight">{meta.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ScenarioGlyph({ id }) {
  const paths = {
    A: <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.8 5.7 21l2.3-7-6-4.6h7.6L12 2z" fill="currentColor" />,
    B: <><rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M16 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" /></>,
    C: <><rect x="5" y="6" width="14" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12h8M8 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" /></>,
    D: <><circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M6 20v-2a4 4 0 018 0v2M15 11h3M16.5 9.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>,
    E: <><circle cx="9" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="15" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M11.2 11.2l3.1 2.3" stroke="currentColor" strokeWidth="1.5" /></>,
    F: <path d="M4 4h16v4H8l8 8H4v-4h12L8 8H4V4z" fill="currentColor" opacity="0.9" />,
    G: <><rect x="5" y="5" width="8" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="9" width="8" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M9 10h2M15 14h2" stroke="currentColor" strokeWidth="1.5" /><path d="M6 6l12 12" stroke="currentColor" strokeWidth="1.5" /></>,
    H: <><circle cx="6" cy="12" r="2" fill="currentColor" /><circle cx="12" cy="12" r="2" fill="currentColor" /><circle cx="18" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" /><path d="M8 12h2M14 12h2" stroke="currentColor" strokeWidth="1.5" /></>,
    I: <path d="M8 12a4 4 0 018 0M6 16h12M4 8l4-2 4 2 4-2 4 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  };
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" aria-hidden>
      {paths[id] || paths.A}
    </svg>
  );
}

function ScenarioCard({ scenario, onCatchAll }) {
  const outcome = SCENARIO_OUTCOME[scenario.id] || { type: 'backend', label: 'Route', emoji: '•' };
  const styles = OUTCOME_STYLES[outcome.type];
  const shortTitle = scenario.title.replace(/^Scenario [A-I]:\s*/i, '');

  return (
    <article
      className={`group flex flex-col rounded-2xl overflow-hidden border-2 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        scenario.id === 'F' ? 'border-[#E2004F]/40 ring-1 ring-[#FFD2DB]' : 'border-[#EBE5D9]'
      } ${styles.border}`}
    >
      <div className={`px-4 py-3 flex items-center justify-between gap-2 border-b ${styles.badge}`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 border border-white/50 text-base font-black text-[#222121] shadow-sm">
            {scenario.id}
          </span>
          <div className={`p-1.5 rounded-lg bg-white/60 ${styles.badge}`}>
            <ScenarioGlyph id={scenario.id} />
          </div>
        </div>
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full border shrink-0 ${styles.badge}`}>
          {outcome.emoji} {outcome.label}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h4 className="font-extrabold text-[#222121] text-sm leading-snug">{shortTitle}</h4>
        <MiniFlowDiagram systems={scenario.systems} outcomeType={outcome.type} />
        <p className="text-sm text-slate-600 leading-relaxed flex-1">{scenario.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#F0EAE1]">
          {(scenario.systems || []).map((key) => {
            const meta = SYSTEM_META[key];
            if (!meta) return null;
            return (
              <span key={key} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${meta.pill}`}>
                {meta.icon}
                {meta.label}
              </span>
            );
          })}
        </div>
        {scenario.id === 'F' && onCatchAll && (
          <button
            type="button"
            onClick={onCatchAll}
            className="mt-1 w-full text-xs font-bold bg-[#E2004F] text-white py-2.5 rounded-xl hover:bg-[#c40044] transition-colors"
          >
            Open Catch-All Monitor (7d) →
          </button>
        )}
      </div>
    </article>
  );
}

function ScenarioCardsGrid({ scenarios, onCatchAll }) {
  return (
    <div className="rounded-2xl border border-[#EBE5D9] bg-[#FAF8F5]/50 overflow-hidden shadow-sm">
      <div className="bg-white border-b border-[#EBE5D9] px-5 py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[#222121]">Routing scenarios A – I</h3>
            <p className="text-xs text-slate-500 mt-1">Every inbound path — color-coded by outcome type</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { dot: 'bg-emerald-500', label: 'Success' },
              { dot: 'bg-amber-500', label: 'Warning' },
              { dot: 'bg-[#E2004F]', label: 'Catch-All' },
              { dot: 'bg-slate-500', label: 'Backend' },
            ].map((x) => (
              <span key={x.label} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-[#FAF8F5] px-2 py-1 rounded-lg border border-[#EBE5D9]">
                <span className={`w-2 h-2 rounded-full ${x.dot}`} />
                {x.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
        {scenarios.map((sc) => (
          <ScenarioCard key={sc.id} scenario={sc} onCatchAll={sc.id === 'F' ? onCatchAll : undefined} />
        ))}
      </div>
    </div>
  );
}

// —— Journey monitor helpers ——
function SystemPill({ systemKey, active }) {
  const meta = SYSTEM_META[systemKey];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full border transition-all ${
        active ? `${meta.pill} scale-105 shadow-sm` : 'bg-slate-50 text-slate-400 border-slate-200 opacity-50'
      }`}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

function FlowStrip({ nodes, activeIndex }) {
  return (
    <div className="flex items-center justify-center gap-1 w-full mb-3 flex-wrap">
      {nodes.map((n, i) => (
        <React.Fragment key={n.key}>
          {i > 0 && <FlowArrow className={i <= activeIndex ? 'text-[#E2004F]' : 'text-slate-300'} />}
          <div
            className={`px-2 py-1 rounded-lg border text-[8px] font-bold flex items-center gap-1 transition-all ${
              i <= activeIndex ? 'bg-[#FFF0F3] border-[#FFD2DB] text-[#E2004F] journey-pulse' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            {n.icon}
            {n.label}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function StepContextBar({ step, journeySteps }) {
  if (!step) return null;
  return (
    <div className="w-full text-left mb-2 pb-2 border-b border-slate-100">
      <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#E2004F]">
        Step {step.num} of {journeySteps.length}
      </p>
      <p className="text-xs font-extrabold text-[#222121] mt-0.5 leading-snug">{step.title}</p>
    </div>
  );
}

function VisualForm() {
  return (
  <div className="w-full animate-scaleUp">
    <FlowStrip
      activeIndex={2}
      nodes={[
        { key: 'visitor', label: 'Visitor', icon: <span className="text-[10px]">🌐</span> },
        { key: 'form', label: 'HiBob Form', icon: <BobIcon /> },
        { key: 'marketo', label: 'Marketo', icon: <MarketoIcon /> },
      ]}
    />
    <div className="w-full max-w-[420px] mx-auto bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl flex text-left">
      <div className="w-7/12 p-5 pr-3.5 relative flex flex-col justify-between">
        <div className="absolute top-3 right-3 text-slate-400"><span className="text-xl font-bold">×</span></div>
        <div>
          <h4 className="text-2xl font-extrabold text-[#222121] font-serif leading-tight">Get a free demo</h4>
          <p className="text-slate-500 text-[10px] mt-0.5 mb-3">Claim your spot today!</p>
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] text-slate-500 font-bold mb-0.5">Business email*</label>
              <input readOnly value="yoav@hitest.io" className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg p-2 text-xs font-mono" />
            </div>
            <div>
              <label className="block text-[9px] text-slate-500 font-bold mb-0.5">Full Name*</label>
              <input readOnly value="Yoav Pintel Test" className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg p-2 text-xs" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 journey-pulse" /> Payload → Marketo (parallel)
          </span>
          <button type="button" className="bg-[#6D193B] text-white text-[10px] font-extrabold px-6 py-2.5 rounded-lg uppercase tracking-wider">NEXT</button>
        </div>
      </div>
      <div className="w-5/12 bg-[#6D193B] relative flex items-center justify-center p-3 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 120" fill="none" aria-hidden>
          <path d="M10 20 C 30 10, 45 40, 30 60 C 15 80, 5 50, 10 20 Z" fill="#EFA94A" opacity="0.8" />
          <path d="M50 20 L53 35 L68 32 L58 42 L72 50 L57 52 L62 67 L50 56 L38 67 L43 52 L28 50 L42 42 L32 32 L47 35 Z" fill="#E2004F" />
        </svg>
        <span className="relative z-10 text-white font-extrabold text-sm">HiBob</span>
      </div>
    </div>
  </div>
  );
}

function VisualEnrichment() {
  return (
    <div className="w-full max-w-[400px] mx-auto animate-scaleUp text-left space-y-3">
      <FlowStrip
        activeIndex={2}
        nodes={[
          { key: 'email', label: 'Email blur', icon: <span className="text-[10px]">@</span> },
          { key: 'zi', label: 'ZoomInfo', icon: <ZoomInfoIcon /> },
          { key: 'fields', label: 'Routing fields', icon: <ChiliPiperIcon /> },
        ]}
      />
      <div className="flex items-center gap-2 justify-center">
        <div className="journey-pulse p-2 rounded-full bg-cyan-100 border border-cyan-300"><ZoomInfoIcon /></div>
        <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-300 via-[#E2004F] to-emerald-400 journey-flow-line" />
        <div className="p-2 rounded-full bg-[#FFF0F3] border border-[#FFD2DB]"><BobIcon /></div>
      </div>
      <h4 className="text-sm font-extrabold text-[#222121] text-center">Background Data Enrichment</h4>
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE5D9] space-y-2 shadow-inner">
        {[
          ['Enrichment Source', 'ZoomInfo API', false],
          ['Extracted Domain', 'hitest.io', false],
          ['HQ Country', 'United States 🇺🇸', false],
          ['Employee Size', '350 Employees', true],
        ].map(([k, v, highlight]) => (
          <div key={k} className={`flex justify-between text-xs border-b border-slate-200 pb-1 ${highlight ? 'font-bold' : ''}`}>
            <span className="text-slate-400">{k}:</span>
            <span className={highlight ? 'text-emerald-600' : 'text-slate-800 font-bold'}>{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-bold border border-amber-200 text-center">
        Blank ZoomInfo → 2nd manual form (Title, Company, Employees)
      </p>
      <div className="flex justify-center gap-1 flex-wrap">
        <SystemPill systemKey="zoominfo" active />
        <SystemPill systemKey="website" active />
      </div>
    </div>
  );
}

function VisualValidation() {
  const checks = [
    { label: 'Spam / QA Test', status: 'Pass', ok: true },
    { label: 'Size 20–8k', status: '350 ✓', ok: true },
    { label: 'SFDC Owner', status: 'None', ok: true },
    { label: 'Customer exclusion', status: 'Clear', ok: true },
  ];
  return (
    <div className="w-full max-w-[400px] mx-auto animate-scaleUp space-y-3">
      <FlowStrip
        activeIndex={1}
        nodes={[
          { key: 'payload', label: 'Payload', icon: <BobIcon /> },
          { key: 'cp', label: 'Concierge', icon: <ChiliPiperIcon /> },
          { key: 'gate', label: 'Calendar?', icon: <span className="text-[10px]">📅</span> },
        ]}
      />
      <h4 className="text-sm font-extrabold text-[#222121] text-center">Chili Piper Guardrails</h4>
      <div className="grid grid-cols-2 gap-2">
        {checks.map((c, i) => (
          <div
            key={c.label}
            className="bg-[#E1F6EE] border border-emerald-200 p-2.5 rounded-xl journey-stagger"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <span className="text-[9px] text-slate-400 block font-bold">{c.label}</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] flex items-center justify-center">✓</span>
              {c.status}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-center text-slate-500">Lead proceeds to live Concierge calendar</p>
      <div className="flex justify-center"><SystemPill systemKey="concierge" active /></div>
    </div>
  );
}

function VisualCalendar() {
  return (
    <div className="w-full max-w-[420px] mx-auto animate-scaleUp text-left font-sans space-y-2">
      <FlowStrip
        activeIndex={2}
        nodes={[
          { key: 'seg', label: 'Segment match', icon: <ChiliPiperIcon /> },
          { key: 'rr', label: 'Round-robin', icon: <span className="text-[10px]">↻</span> },
          { key: 'book', label: 'Disco Call', icon: <span className="text-[10px]">📅</span> },
        ]}
      />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#9B6B9E] text-white flex items-center justify-center font-bold text-sm">Y</div>
            <div>
              <p className="text-xs text-slate-400">Pick a time with:</p>
              <h5 className="text-sm font-extrabold text-[#222121]">Yoav Pintel</h5>
            </div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#E2004F] text-white flex items-center justify-center font-extrabold text-sm">Hi</div>
        </div>
        <h4 className="text-[#E2004F] font-bold text-center text-sm mb-3">What day is best for you?</h4>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-[#FAF8F5] border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 text-[8px] font-extrabold py-1 text-center text-slate-400 border-b">Sun Mon Tue Wed Thu Fri Sat</div>
            <div className="grid grid-cols-7 text-center text-[10px] py-1.5 font-bold">
              <span className="text-slate-300">24</span><span>25</span><span>26</span><span>27</span>
              <span className="bg-[#E2004F] text-white py-1 rounded-lg shadow-sm journey-pulse">28</span>
              <span>29</span><span className="text-slate-300">30</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
          {['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'].map((t, i) => (
            <button key={t} type="button" className={`border py-2 rounded-xl ${i === 1 ? 'border-[#E2004F] bg-[#FFF0F3] text-[#E2004F] journey-pulse' : 'border-slate-200 bg-white'}`}>{t}</button>
          ))}
        </div>
        <p className="text-[9px] text-center text-slate-400 mt-2">Meeting_Type_CP__c → &quot;Disco Call&quot;</p>
      </div>
      <div className="flex justify-center gap-1 flex-wrap">
        <SystemPill systemKey="concierge" active />
        <SystemPill systemKey="salesforce" active />
      </div>
    </div>
  );
}

function VisualRingLead() {
  const chain = [
    { key: 'marketo', label: 'Marketo', sub: 'Ingested & scored', ok: true },
    { key: 'salesforce', label: 'Salesforce', sub: 'Priority MQL', ok: true },
    { key: 'ringlead', label: 'RingLead', sub: 'Passed', ok: true },
  ];
  return (
    <div className="w-full max-w-[400px] mx-auto animate-scaleUp space-y-3 text-left">
      <h4 className="text-sm font-extrabold text-[#222121] text-center">Marketo &amp; CRM Sync</h4>
      <div className="flex flex-col gap-1">
        {chain.map((item, i) => (
          <React.Fragment key={item.key}>
            {i > 0 && <div className="flex justify-center"><div className="w-0.5 h-3 bg-[#E2004F]/40" /></div>}
            <div className={`flex items-center gap-3 p-2.5 rounded-xl border ${item.ok ? 'bg-white border-[#EBE5D9]' : 'bg-rose-50 border-rose-200'} journey-stagger`} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="shrink-0">{SYSTEM_META[item.key]?.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-extrabold text-[#222121]">{item.label}</p>
                <p className="text-[9px] text-slate-500">{item.sub}</p>
              </div>
              <span className="text-emerald-600 font-bold text-xs">✓</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-center gap-1 flex-wrap">
        {chain.map((c) => <SystemPill key={c.key} systemKey={c.key} active />)}
      </div>
    </div>
  );
}

function VisualDistro() {
  const reps = ['Rep A', 'Rep B', 'Rep C', 'Rep D'];
  return (
    <div className="w-full max-w-[400px] mx-auto animate-scaleUp space-y-3 text-left">
      <FlowStrip
        activeIndex={2}
        nodes={[
          { key: 'sfdc', label: 'SF Trigger', icon: <SalesforceIcon /> },
          { key: 'rl', label: 'RingLead OK', icon: <RingLeadIcon /> },
          { key: 'distro', label: 'Distro', icon: <ChiliPiperIcon /> },
        ]}
      />
      <h4 className="text-sm font-extrabold text-[#222121] text-center">Backend Chili Piper Distro</h4>
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE5D9] text-center">
        <p className="text-[10px] text-slate-600 mb-3">Strict Round-Robin — silent assignment when calendar abandoned</p>
        <div className="flex justify-center items-center gap-2 flex-wrap">
          {reps.map((r, i) => (
            <div
              key={r}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-[8px] font-bold ${
                i === 1 ? 'border-[#E2004F] bg-[#FFF0F3] text-[#E2004F] scale-110 journey-pulse' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {r.split(' ')[1]}
            </div>
          ))}
        </div>
        <p className="text-[9px] font-mono text-[#E2004F] font-bold mt-3">→ Rep B assigned</p>
      </div>
      <SystemPill systemKey="distro" active />
    </div>
  );
}

function VisualHandoff() {
  return (
    <div className="w-full max-w-[400px] mx-auto animate-scaleUp space-y-3 text-left">
      <FlowStrip
        activeIndex={2}
        nodes={[
          { key: 'xdr', label: 'XDR', icon: <span className="text-[10px]">🎧</span> },
          { key: 'ext', label: 'CP Extension', icon: <ChiliPiperIcon /> },
          { key: 'ae', label: 'Pod AE', icon: <span className="text-[10px]">🎯</span> },
        ]}
      />
      <h4 className="text-sm font-extrabold text-[#222121] text-center">Discovery Handoff to AE</h4>
      <div className="bg-white border-2 border-emerald-400 p-4 rounded-2xl shadow-md">
        <p className="text-[10px] font-bold text-emerald-600 mb-2">Salesforce Pod Transfer</p>
        <div className="flex justify-between items-center gap-2">
          <div className="text-center flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[9px] text-slate-400">XDR</p>
            <p className="text-xs font-bold">Alex</p>
          </div>
          <span className="text-[#E2004F] font-bold journey-pulse">→</span>
          <div className="text-center flex-1 p-2 rounded-xl bg-emerald-50 border border-emerald-300 journey-pulse">
            <p className="text-[9px] text-emerald-600">Suggested AE</p>
            <p className="text-xs font-bold text-emerald-800">Jordan (Pod West)</p>
          </div>
        </div>
        <p className="text-[9px] text-slate-500 mt-2 italic">Manual Pod mapping — bypasses region/size rules</p>
      </div>
      <SystemPill systemKey="handoff" active />
      <SystemPill systemKey="salesforce" active />
    </div>
  );
}

const VISUAL_BY_STATE = {
  form: VisualForm,
  enrichment: VisualEnrichment,
  validation: VisualValidation,
  calendar: VisualCalendar,
  ringlead: VisualRingLead,
  distro: VisualDistro,
  handoff: VisualHandoff,
};

function JourneyVisualMonitor({ activeStepId, journeySteps, onStepClick }) {
  const step = useMemo(() => journeySteps.find((s) => s.id === activeStepId), [activeStepId, journeySteps]);
  const visualState = step?.visualState;
  const Visual = VISUAL_BY_STATE[visualState];

  return (
    <>
      <StepContextBar step={step} journeySteps={journeySteps} />
      <div className="my-auto py-2 flex flex-col items-center justify-center text-center w-full min-h-[380px]">
        {Visual ? <Visual key={visualState} /> : <p className="text-slate-400 text-sm">Select a step</p>}
      </div>
      <div className="flex justify-center space-x-1 pt-3 border-t border-slate-100">
        {journeySteps.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onStepClick && onStepClick(s.id)}
            aria-label={`Go to step ${s.num}`}
            className={`h-2.5 rounded-full transition-all ${
              activeStepId === s.id ? 'bg-[#E2004F] w-6' : 'bg-slate-200 hover:bg-slate-300 w-2.5'
            }`}
          />
        ))}
      </div>
    </>
  );
}

/** Extra copy + systems for Interactive Story step cards */
const STEP_JOURNEY_META = {
  step1: {
    emoji: '📝',
    accent: 'from-rose-50 to-white',
    systems: ['website', 'marketo'],
    subtitle: 'Every submission enters Marketo — no exceptions',
    detailedDesc:
      'A prospect lands on an approved high-intent page (RAD, WAD, Pricing, Product Tour, Contact Us) and submits their name and business email. The moment they leave the email field, the domain is extracted and parallel routing begins. Critically: the website never filters leads out of Marketo based on size or booking outcome.',
  },
  step2: {
    emoji: '🔍',
    accent: 'from-cyan-50 to-white',
    systems: ['website', 'zoominfo', 'marketo'],
    subtitle: 'ZoomInfo fills country, state, and employee count',
    detailedDesc:
      'On email focus-out, the site calls ZoomInfo (Clay planned) for HQ country, HQ state, and employee count. These map to Chili Piper payload fields like cb_company_employees__c and PersonCountry. If enrichment fails, a dynamic second-step form captures title, company, and headcount as the lowest-priority fallback.',
  },
  step3: {
    emoji: '🛡️',
    accent: 'from-amber-50 to-white',
    systems: ['concierge', 'salesforce'],
    subtitle: 'Spam, exclusions, ownership, and the 20–8,000 window',
    detailedDesc:
      'Chili Piper Concierge runs spam scoring, QA allowlists, customer/churn exclusions, and Salesforce ownership lookup. Only companies with 20–8,000 employees see a live calendar. An active CRM owner on the Ownership team bypasses round-robin and routes straight to that rep.',
  },
  step4: {
    emoji: '📅',
    accent: 'from-orange-50 to-white',
    systems: ['concierge', 'salesforce'],
    subtitle: 'Live calendar — Flexible Round-Robin, Disco Call only',
    detailedDesc:
      'Qualified prospects see an on-page Chili Piper calendar instantly. They pick a slot from available reps (Flexible Round-Robin). The booked meeting is always a Disco Call — never a Demo Call from this Concierge step. Activity fields Booking_Status_CP__c and Meeting_Type_CP__c are written to Salesforce.',
  },
  step5: {
    emoji: '🔗',
    accent: 'from-teal-50 to-white',
    systems: ['marketo', 'salesforce', 'ringlead'],
    subtitle: 'Marketo scoring + RingLead deduplication',
    detailedDesc:
      'In parallel with the visitor experience, Marketo scores the lead and syncs to Salesforce. RingLead runs strict deduplication — if it fails, backend Distro assignment is blocked and the account queues for MOPS manual review.',
  },
  step6: {
    emoji: '⚙️',
    accent: 'from-slate-100 to-white',
    systems: ['distro', 'salesforce', 'ringlead'],
    subtitle: 'Silent Strict Round-Robin when calendar is abandoned',
    detailedDesc:
      'If the lead qualified for Concierge but left without booking, Distro assigns an owner in the background using Region__c, Account_Employees__c, and state. Strict Round-Robin balances quota. No matching Distro rule → Catch-All for MOPS.',
  },
  step7: {
    emoji: '🤝',
    accent: 'from-emerald-50 to-white',
    systems: ['handoff', 'salesforce'],
    subtitle: 'XDR → AE via Handoff pods (not geography)',
    detailedDesc:
      'After the discovery call, the rep uses Chili Piper Handoff from Salesforce to schedule the AE meeting. Routing follows sales Pod pairings from the Handoff spreadsheet — not region or employee segments. Managed by the RevOps team.',
  },
};

function SystemPillRow({ systems }) {
  if (!systems?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {systems.map((key) => {
        const meta = SYSTEM_META[key];
        if (!meta) return null;
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${meta.pill}`}
          >
            {meta.icon}
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

function JourneyHero({ onStartJourney }) {
  const pipeline = [
    { num: 1, label: 'Form', emoji: '📝' },
    { num: 2, label: 'Enrich', emoji: '🔍' },
    { num: 3, label: 'Validate', emoji: '🛡️' },
    { num: 4, label: 'Book', emoji: '📅' },
    { num: 5, label: 'Dedupe', emoji: '🔗' },
    { num: 6, label: 'Distro', emoji: '⚙️' },
    { num: 7, label: 'Handoff', emoji: '🤝' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#222121] via-[#2a2828] to-[#1a1919] text-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#333]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2004F]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#FFB3C7] bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
          Interactive Story · 7 stages
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mt-5 tracking-tight leading-tight">
          Lead Routing &amp; Booking Journey
        </h2>
        <p className="text-base md:text-lg text-slate-300 mt-4 leading-relaxed max-w-3xl mx-auto">
          From the first form submit on hibob.com through ZoomInfo enrichment, Chili Piper Concierge live booking,
          Marketo + Salesforce sync, RingLead dedupe, Distro backend assignment, and post-call AE Handoff —
          this is the complete path a website handraiser takes.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: '7 pipeline stages', value: '7' },
            { label: 'Live bookable band', value: '20–8K' },
            { label: 'Core systems', value: '8+' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-5 py-3 min-w-[120px]">
              <p className="text-2xl font-extrabold text-[#E2004F]">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center justify-center gap-1 mt-10 flex-wrap">
          {pipeline.map((p, i) => (
            <React.Fragment key={p.num}>
              <div className="flex flex-col items-center gap-1 min-w-[52px]">
                <span className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-lg">
                  {p.emoji}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{p.label}</span>
              </div>
              {i < pipeline.length - 1 && <span className="text-slate-500 text-sm pb-4">→</span>}
            </React.Fragment>
          ))}
        </div>
        {onStartJourney && (
          <button
            type="button"
            onClick={onStartJourney}
            className="mt-8 text-sm font-bold bg-[#E2004F] hover:bg-[#ff1a5c] text-white px-6 py-3 rounded-xl shadow-lg transition-colors"
          >
            Start scrolling the journey ↓
          </button>
        )}
      </div>
    </section>
  );
}

function JourneyAccordion({ id, title, icon, open, onToggle, children }) {
  return (
    <div className={`rounded-2xl border bg-white transition-colors ${open ? 'border-[#E2004F]/50 shadow-sm' : 'border-[#EBE5D9]'}`}>
      <button
        type="button"
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`w-full flex justify-between items-center gap-3 px-4 py-3.5 text-left text-sm font-bold transition-colors ${
          open ? 'bg-[#FFF0F3] text-[#222121]' : 'bg-[#FAF8F5] text-slate-800 hover:bg-[#F5F1E9]'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{icon}</span>
          <span>{title}</span>
        </span>
        <span
          className={`text-slate-400 text-xs shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          id={`${id}-panel`}
          role="region"
          aria-labelledby={`${id}-btn`}
          className="border-t border-[#EBE5D9] bg-white px-4 py-3 max-h-[min(280px,40vh)] overflow-y-auto custom-scroll"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function JourneyStepCards({
  steps,
  activeStepId,
  stepRefs,
  scrollToStep,
  expandedBR,
  expandedTS,
  toggleBR,
  toggleTS,
  FormattedText,
  singleStepOnly = false,
}) {
  const visibleSteps = singleStepOnly
    ? steps.filter((step) => step.id === activeStepId)
    : steps;

  return (
    <>
      {visibleSteps.map((step) => {
        const isActive = activeStepId === step.id;
        const meta = STEP_JOURNEY_META[step.id] || {};
        return (
          <article
            key={step.id}
            id={step.id}
            ref={(el) => { if (stepRefs) stepRefs.current[step.id] = el; }}
            onClick={singleStepOnly ? undefined : () => scrollToStep(step.id)}
            className={`rounded-3xl border-2 transition-all duration-300 ${
              singleStepOnly ? 'flex flex-col' : 'overflow-hidden h-full cursor-pointer'
            } ${
              isActive
                ? 'border-[#E2004F] shadow-xl bg-white'
                : 'border-[#EBE5D9] bg-white/80 hover:border-slate-400 hover:shadow-md'
            }`}
          >
            <div className={`bg-gradient-to-r ${meta.accent || 'from-[#FAF8F5] to-white'} px-6 md:px-8 py-5 border-b border-[#EBE5D9]/60`}>
              <div className="flex flex-wrap items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${
                    isActive ? 'bg-[#FFF0F3] border-[#FFD2DB]' : 'bg-white border-[#EBE5D9]'
                  }`}
                >
                  {meta.emoji || step.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-[#E2004F] text-white border-[#E2004F]'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      Step {step.num} of {steps.length}
                    </span>
                    {isActive && (
                      <span className="text-[11px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                        Live preview ←
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-[#222121] leading-snug">
                    {FormattedText ? <FormattedText text={step.title} /> : step.title}
                  </h3>
                  {meta.subtitle && (
                    <p className="text-sm font-semibold text-[#E2004F] mt-1">{meta.subtitle}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 py-6 pb-8 space-y-4">
              <p className="text-base text-slate-700 leading-relaxed">
                {FormattedText ? <FormattedText text={step.simpleDesc} /> : step.simpleDesc}
              </p>
              {meta.detailedDesc && (
                <p className="text-sm text-slate-600 leading-relaxed bg-[#FAF8F5] border border-[#EBE5D9] rounded-xl p-4">
                  {meta.detailedDesc}
                </p>
              )}
              <SystemPillRow systems={meta.systems} />

              <div className={`flex flex-col gap-3 pt-2 ${singleStepOnly ? '' : 'md:grid md:grid-cols-2'}`}>
                <JourneyAccordion
                  id={`${step.id}-br`}
                  title="Business rules"
                  icon="⚠️"
                  open={Boolean(expandedBR[step.id])}
                  onToggle={() => toggleBR(step.id)}
                >
                  <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
                    {step.businessRules.map((rule, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-[#E2004F] font-bold shrink-0">•</span>
                        <span>{FormattedText ? <FormattedText text={rule} /> : rule}</span>
                      </li>
                    ))}
                  </ul>
                </JourneyAccordion>
                <JourneyAccordion
                  id={`${step.id}-ts`}
                  title="Technical details"
                  icon="🛠️"
                  open={Boolean(expandedTS[step.id])}
                  onToggle={() => toggleTS(step.id)}
                >
                  <ul className="space-y-3 text-sm text-slate-700 leading-relaxed">
                    {step.techSpecs.map((spec, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-indigo-500 font-bold shrink-0">•</span>
                        <span className="font-sans">{FormattedText ? <FormattedText text={spec} /> : spec}</span>
                      </li>
                    ))}
                  </ul>
                </JourneyAccordion>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
}

window.ScenarioCardsGrid = ScenarioCardsGrid;
window.JourneyVisualMonitor = JourneyVisualMonitor;
window.JourneyHero = JourneyHero;
window.JourneyStepCards = JourneyStepCards;
