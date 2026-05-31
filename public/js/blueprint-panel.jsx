/* global React */

const BobIcon = () => (
  <svg className="w-4 h-4 text-[#E2004F] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const ChiliPiperIcon = () => (
  <svg className="w-4 h-4 text-[#FF4500] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C11.5 2 11 2.5 11 3C11 4.5 9.5 5.5 8 5.5C7.5 5.5 7 6 7 6.5C7 7.5 5.5 8.5 4 8.5C3.5 8.5 3 9 3 9.5C3 11 4.5 12 5.5 13.5C5.5 14 5 14.5 5 15C5 18.5 9 22 13 22C17 22 21 18.5 21 15C21 11.5 19 8.5 16 7C14.5 6 13.5 4.5 13 3C13 2.5 12.5 2 12 2Z" />
  </svg>
);
const SalesforceIcon = () => (
  <svg className="w-4 h-4 text-[#00A1E0] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" />
  </svg>
);
const MarketoIcon = () => (
  <svg className="w-4 h-4 text-[#5C2D91] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" />
  </svg>
);
const ZoomInfoIcon = () => (
  <svg className="w-4 h-4 text-[#007C92] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);
const RingLeadIcon = () => (
  <svg className="w-4 h-4 text-[#004A8F] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const SYSTEM_META = {
  website: { label: 'Website', icon: <BobIcon />, pill: 'bg-[#FFF0F3] text-[#E2004F] border-[#FFD2DB]', accent: '#E2004F' },
  zoominfo: { label: 'ZoomInfo', icon: <ZoomInfoIcon />, pill: 'bg-cyan-50 text-cyan-800 border-cyan-200', accent: '#007C92' },
  concierge: { label: 'Concierge', icon: <ChiliPiperIcon />, pill: 'bg-orange-50 text-orange-800 border-orange-200', accent: '#FF4500' },
  marketo: { label: 'Marketo', icon: <MarketoIcon />, pill: 'bg-purple-50 text-purple-800 border-purple-200', accent: '#5C2D91' },
  salesforce: { label: 'Salesforce', icon: <SalesforceIcon />, pill: 'bg-blue-50 text-blue-800 border-blue-200', accent: '#00A1E0' },
  ringlead: { label: 'RingLead', icon: <RingLeadIcon />, pill: 'bg-teal-50 text-teal-800 border-teal-200', accent: '#004A8F' },
  distro: { label: 'Distro', icon: <ChiliPiperIcon />, pill: 'bg-indigo-50 text-indigo-800 border-indigo-200', accent: '#4F46E5' },
  handoff: { label: 'Handoff', icon: <ChiliPiperIcon />, pill: 'bg-emerald-50 text-emerald-800 border-emerald-200', accent: '#059669' },
};

const VIEW_MODES = [
  { id: 'business', label: 'Business', icon: '💼', desc: 'RevOps & sales narrative' },
  { id: 'technical', label: 'Technical', icon: '⚙️', desc: 'APIs, fields & integrations' },
  { id: 'mixed', label: 'Hybrid', icon: '🔀', desc: 'Combined operational view' },
];

const BLUEPRINT_NODES = {
  website: {
    emoji: '📝',
    step: 1,
    systems: ['website', 'marketo'],
    stageLabels: { business: 'Step 1 · Website Handraiser', technical: 'Stage 1 · Payload capture', mixed: 'Stage 1 · Web capture' },
    business: {
      title: 'Handraiser submission',
      sub: 'RAD, WAD, Pricing, Product Tour, Contact Us — high-intent only.',
      inspectTitle: 'Business: Handraiser submission event',
      inspectDesc:
        'A high-intent visitor submits an approved form. Every submission enters Marketo — the website never filters leads out based on size or whether they book. Chili Piper eligibility runs in parallel after enrichment.',
      bullets: [
        'Approved pages: RAD, WAD, Pricing, Product Tour, Contact Us',
        'Universal Marketo log — no lead is dropped at the form layer',
        'Email focus-out triggers domain extraction + enrichment pipeline',
        'Second-step form only when ZoomInfo returns no firmographics',
      ],
      outcomes: ['All leads → Marketo', 'Qualified subset → Concierge calendar'],
      fields: ['FirstName', 'LastName', 'Email', 'Form page URL'],
    },
    technical: {
      title: 'Website payload ingestion',
      sub: 'DOM focus-out extracts corporate domain; JSON payload to parallel APIs.',
      inspectTitle: 'Technical: Form payload & domain extraction',
      inspectDesc:
        'Client-side listeners on the email field fire on focus-out, parse the domain from the business email, and package FirstName, LastName, Email into a JSON payload. Parallel requests go to ZoomInfo and Chili Piper Concierge without blocking the user.',
      bullets: [
        'focus-out event → domain parse (e.g. techcorp.com)',
        'Initial payload: FirstName, LastName, Email, source URL',
        'Non-blocking parallel: ZoomInfo GET + Concierge embed init',
        'Dynamic Step 2 DOM injection when enrichment status = failed',
      ],
      outcomes: ['Payload → ZoomInfo', 'Payload → Concierge script', 'Always → Marketo REST'],
      fields: ['email', 'firstName', 'lastName', 'source', 'formPage'],
    },
    mixed: {
      title: 'Handraiser web capture',
      sub: 'Forms extract domain on email focus-out; Marketo receives all traffic.',
      inspectTitle: 'Mixed: Web capture & parallel sync',
      inspectDesc:
        'Prospect submits an approved form. Behind the scenes, email focus-out parses the company domain while enrichment and Concierge initialize in parallel. Marketo ingestion is unconditional.',
      bullets: [
        'High-intent forms only — lower-intent pages skip live Concierge',
        'Domain extraction drives all downstream segment rules',
        'Marketo + Concierge run in parallel, not sequentially',
      ],
      outcomes: ['Marketo: 100% of submissions', 'Concierge: qualified band only'],
      fields: ['Email domain', 'Form source', 'cb_company_employees__c (post-enrich)'],
    },
  },
  zoominfo: {
    emoji: '🔍',
    step: 2,
    systems: ['website', 'zoominfo', 'concierge'],
    stageLabels: { business: 'Step 2 · Firmographic profile', technical: 'Stage 2 · Enrichment API', mixed: 'Stage 2 · Telemetry' },
    business: {
      title: 'Company telemetry check',
      sub: 'Silent lookup of HQ country, state, and employee count before routing.',
      inspectTitle: 'Business: Automatic firmographic profile',
      inspectDesc:
        'Before any calendar renders, ZoomInfo confirms company size and geography. These values determine the 20–8,000 live-booking window and which Concierge segment rule applies. Failed enrichment triggers a manual second form — lowest priority data source.',
      bullets: [
        'Real-time domain lookup on email focus-out',
        'Employee count gates live Concierge (20–8,000)',
        'HQ country + state drive regional segment rules',
        'Clay migration planned; manual form is fallback only',
      ],
      outcomes: ['Enriched → segment rules apply', 'Failed → Step 2 manual capture'],
      fields: ['cb_company_employees__c', 'PersonCountry', 'cb_company_state__c'],
    },
    technical: {
      title: 'Enrichment API pipeline',
      sub: 'ZoomInfo REST → HQ Country, State, cb_company_employees__c.',
      inspectTitle: 'Technical: Real-time telemetry enrichment',
      inspectDesc:
        'Background GET to ZoomInfo REST API using parsed domain. Response maps to Chili Piper custom fields. Timeout or empty response triggers dynamic Step 2 inputs. Salesforce account data can override when an existing account is found.',
      bullets: [
        'GET ZoomInfo by domain → employee count, HQ country, HQ state',
        'Maps to cb_company_employees__c, CB_Company_Country__c, cb_company_state__c',
        'Latency threshold → show manual Step 2 form',
        'SFDC account override when Account already exists',
      ],
      outcomes: ['Success → Concierge payload complete', 'Fail → manual fallback fields'],
      fields: ['cb_company_employees__c', 'CB_Company_Country__c', 'cb_company_state__c', 'Company'],
    },
    mixed: {
      title: 'Firmographic data enrichment',
      sub: 'Silent API fetch of HQ location & size; feeds all routers.',
      inspectTitle: 'Mixed: ZoomInfo telemetry enrichment',
      inspectDesc:
        'ZoomInfo validates size and geography before Concierge segment evaluation. Data flows into both the live calendar gate and Distro backend rules (Region__c, Account_Employees__c).',
      bullets: [
        'Single enrichment pass on focus-out (Marketo may re-enrich async)',
        'Employee band: Micro 20–49, Small 50–149, Mid 150–499, etc.',
        'US state-level routing for US segments',
      ],
      outcomes: ['In band 20–8K → calendar eligible', 'Out of band → no live book'],
      fields: ['Employees', 'Country', 'State/Province'],
    },
  },
  concierge: {
    emoji: '📅',
    step: 3,
    systems: ['concierge', 'salesforce'],
    stageLabels: { business: 'Step 3 · Calendar eligibility', technical: 'Stage 3 · Concierge routing', mixed: 'Stage 3 · Calendar gate' },
    business: {
      title: 'Calendar eligibility gate',
      sub: 'Live slots for 20–8,000 employees; Disco Call only; ownership bypass.',
      inspectTitle: 'Business: Live scheduling decisions',
      inspectDesc:
        'Chili Piper Concierge is the on-page calendar experience. Before slots appear, the system checks spam, QA allowlists, customer/churn exclusions, and Salesforce ownership. An active owner on the CP Ownership Team skips round-robin entirely.',
      bullets: [
        '20–8,000 employees required for live calendar',
        'Meeting type locked to Disco Call (never Demo from Concierge)',
        'Flexible Round-Robin across available reps',
        'Active SFDC owner → direct route, no round-robin',
        'Abandon calendar → Distro backend path (Step 5)',
      ],
      outcomes: ['Booked → SFDC Activity + owner', 'Abandoned → Distro', 'Excluded → no calendar'],
      fields: ['Booking_Status_CP__c', 'Meeting_Type_CP__c', 'Queue_Name_CP__c', 'Router_Name_CP__c'],
    },
    technical: {
      title: 'Chili Piper Concierge script',
      sub: 'Spam scoring, QA whitelist, SFDC ownership lookup, segment rules.',
      inspectTitle: 'Technical: Concierge routing & exclusions',
      inspectDesc:
        'Client-side Chili Piper library evaluates JSON payload against router 7e9c794d segment rules. Real-time SFDC lookup for Ownership team. Spam check score and exclusion lists evaluated before calendar render.',
      bullets: [
        'Router: MQL Inbound main (7e9c794d-b6db-40ec-ae07-f363d77b5f36)',
        'Segment match: Region + employee micro-band + US state',
        'No match → Catch-All (Routing Rule Matched = Catch All)',
        'Flexible Round-Robin pool from inbound spreadsheet column I',
      ],
      outcomes: ['Match + in band → calendar', 'No match → Catch-All', 'Owner found → bypass RR'],
      fields: ['routingRuleMatched', 'assignedTo', 'spamCheckScore', 'status'],
    },
    mixed: {
      title: 'Chili Piper Concierge UI',
      sub: 'On-page scheduler with guardrails before any slot renders.',
      inspectTitle: 'Mixed: Inbound calendar guardrails',
      inspectDesc:
        'Qualified prospects see the Concierge embed. Exclusions (customers, churn, spam, QA) run programmatically. Booked meetings write Chili Piper activity fields to Salesforce immediately.',
      bullets: [
        'Visual: on-page calendar widget (not redirect)',
        'Booked = gold path (Scenario A)',
        'Abandoned qualified = Distro silent assign (Scenario C)',
      ],
      outcomes: ['Scenario A: booked', 'Scenario B: abandoned UI', 'Scenario F: Catch-All'],
      fields: ['cb_company_employees__c', 'country', 'state', 'ownerId'],
    },
  },
  marketo: {
    emoji: '📣',
    step: '4A',
    systems: ['marketo', 'website'],
    stageLabels: { business: 'Step 4A · Lead scoring', technical: 'Stage 4A · REST sync', mixed: 'Stage 4A · Scrub & score' },
    business: {
      title: 'Universal lead log',
      sub: 'Every submission — scoring, dedupe, MQL conversion, async enrichment.',
      inspectTitle: 'Business: Marketing lead ingestion',
      inspectDesc:
        'Marketo is the universal sink. No website lead is filtered out here. Scoring models run, duplicates are flagged, and MQL thresholds trigger Salesforce sync. Secondary ZoomInfo enrichment may run asynchronously after initial capture.',
      bullets: [
        '100% of form submissions ingested — no exceptions',
        'Lead scoring + MQL rules drive SFDC handoff timing',
        'Secondary enrichment pass if fields were empty at submit',
        'Runs in parallel with Concierge (not after booking)',
      ],
      outcomes: ['Below MQL → nurture', 'MQL → Salesforce sync triggered'],
      fields: ['Lead Score', 'MQL Date', 'Original Source'],
    },
    technical: {
      title: 'Marketo ingestion REST sync',
      sub: 'Async POST; scoring programs; secondary ZoomInfo trigger.',
      inspectTitle: 'Technical: REST ingestion & secondary enrichment',
      inspectDesc:
        'Form payload mapped to Marketo REST API asynchronously. Scoring programs and dedupe logic execute server-side. Converted MQL records sync to Salesforce via native connector or middleware.',
      bullets: [
        'REST API lead insert/update on every form submit',
        'Scoring program + dedupe smart campaigns',
        'MQL transition → SFDC Lead/Contact sync',
        'May re-trigger ZoomInfo for missing firmographics',
      ],
      outcomes: ['API 200 → lead in program', 'MQL → SFDC connector fires'],
      fields: ['email', 'company', 'employeeRange', 'leadSource'],
    },
    mixed: {
      title: 'Marketo ingest & score',
      sub: 'Parallel path — not blocked by Concierge booking outcome.',
      inspectTitle: 'Mixed: Lead processing & qualification',
      inspectDesc:
        'Marketo processes all leads regardless of whether Concierge showed a calendar or the prospect booked. This ensures marketing attribution and nurture paths remain intact.',
      bullets: [
        'Parallel to Concierge — not sequential',
        'Dedupe flags feed RingLead/SFDC gate',
      ],
      outcomes: ['Always logged', 'MQL when score threshold met'],
      fields: ['Score', 'Status', 'Person Type'],
    },
  },
  salesforce: {
    emoji: '☁️',
    step: '4B',
    systems: ['salesforce', 'ringlead', 'marketo'],
    stageLabels: { business: 'Step 4B · CRM ingestion', technical: 'Stage 4B · Dedupe gate', mixed: 'Stage 4B · CRM & RingLead' },
    business: {
      title: 'CRM record association',
      sub: 'Lead, Contact, Priority Account — RingLead dedupe before Distro.',
      inspectTitle: 'Business: CRM system of record',
      inspectDesc:
        'Salesforce receives MQL records as Leads or Contacts under Priority Accounts. RingLead runs strict deduplication — a failed match blocks Distro assignment and queues the account for MOPS manual review (Scenario G).',
      bullets: [
        'Booked lead → Account status Prospect + Activity',
        'Unbooked → Priority Unassigned → Distro trigger',
        'RingLead pass required before backend assignment',
        'Failed dedupe → MOPS monitoring list, Distro blocked',
      ],
      outcomes: ['Dedupe pass → Distro eligible', 'Dedupe fail → manual queue', 'Booked → owned Activity'],
      fields: ['Region__c', 'Account_Employees__c', 'OwnerId', 'Priority Account status'],
    },
    technical: {
      title: 'Salesforce APEX & RingLead gate',
      sub: 'APEX handlers, RingLead matchers, Distro API trigger conditions.',
      inspectTitle: 'Technical: APEX handlers & RingLead matchers',
      inspectDesc:
        'Custom APEX on MQL insert/update invokes RingLead matching algorithms. Successful match allows Chili Piper Distro REST API call. Failed match sets hold flags and prevents round-robin assignment.',
      bullets: [
        'APEX trigger on Lead/Contact MQL conversion',
        'RingLead strict match → proceed to Distro',
        'RingLead fail → block Distro, flag for MOPS',
        'Activity fields from Concierge write on book',
      ],
      outcomes: ['Match → Distro REST invoked', 'No match → Scenario G hold'],
      fields: ['Region__c', 'Account_Employees__c', 'BillingState', 'OwnerId'],
    },
    mixed: {
      title: 'CRM sync & RingLead gate',
      sub: 'Clean data required before silent backend routing.',
      inspectTitle: 'Mixed: Salesforce CRM & RingLead integration',
      inspectDesc:
        'Salesforce is the system of record for ownership and territory. RingLead ensures duplicate accounts do not receive double assignment. Only clean, deduped records proceed to Distro.',
      bullets: [
        'Priority Account model for inbound handraisers',
        'Ownership team lookup feeds Concierge bypass',
        'Distro reads Region__c + Account_Employees__c',
      ],
      outcomes: ['Clean record → Distro', 'Dirty → MOPS', 'Catch-All if no segment'],
      fields: ['Region__c', 'Account_Employees__c', 'Routing status'],
    },
  },
  distro: {
    emoji: '⚙️',
    step: 5,
    systems: ['distro', 'salesforce', 'ringlead'],
    stageLabels: { business: 'Step 5 · Silent assign', technical: 'Stage 5 · Distro API', mixed: 'Stage 5 · Backend route' },
    business: {
      title: 'Backend lead distribution',
      sub: 'Strict Round-Robin for unbooked accounts; Catch-All when no rule matches.',
      inspectTitle: 'Business: Silent backend routing',
      inspectDesc:
        'When a qualified prospect abandons the Concierge calendar, Distro assigns ownership silently — no second UI. Strict Round-Robin balances rep quota by region and employee band. No matching rule → Catch-All for MOPS (Scenario F).',
      bullets: [
        'Triggers only when Concierge was eligible but not booked',
        'Strict Round-Robin (not Flexible — that is Concierge only)',
        'Segment rules mirror inbound spreadsheet (column I teams)',
        'No match → Catch-All bucket, no owner assigned',
      ],
      outcomes: ['Assigned → rep owns Priority Account', 'No rule → Catch-All', 'Dedupe fail → blocked'],
      fields: ['Region__c', 'Account_Employees__c', 'US State', 'assignedTo'],
    },
    technical: {
      title: 'Distro REST API router',
      sub: 'SFDC-triggered REST; Strict RR; logs Catch-All on unmatched.',
      inspectTitle: 'Technical: Programmatic Distro assignments',
      inspectDesc:
        'Salesforce APEX or workflow triggers Chili Piper Distro REST API. Distro evaluates Region__c, Account_Employees__c, and state against active rules. Unmatched requests log routingRuleMatched = Catch All in Concierge exports.',
      bullets: [
        'REST API from SFDC on MQL + dedupe pass + unbooked',
        'Strict Round-Robin algorithm per segment',
        'Catch-All = no active segment rule matched',
        'Dashboard tracks Catch-All volume (this portal)',
      ],
      outcomes: ['Rule match → owner assigned', 'No match → Catch-All', 'Scenario H: Distro gap'],
      fields: ['routingRuleMatched', 'assignmentMethod', 'assignedTo'],
    },
    mixed: {
      title: 'Chili Piper Distro backend',
      sub: 'Silent assignment path for abandoned qualified calendars.',
      inspectTitle: 'Mixed: Silent backend lead allocation',
      inspectDesc:
        'Distro is the safety net for qualified leads who did not book live. It runs entirely in the background — reps see a new Priority Account assignment without the prospect interacting with a second scheduler.',
      bullets: [
        'Scenario C: qualified + abandoned calendar',
        'Scenario F: Catch-All when rules fail',
        'Complements Concierge — does not replace it',
      ],
      outcomes: ['Backend assign', 'Catch-All', 'Post-call → Handoff (Step 7)'],
      fields: ['Region', 'Employees', 'State', 'Team queue'],
    },
  },
};

const NODE_ORDER = ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'distro'];
const PARALLEL_NODES = ['marketo', 'salesforce'];

function FlowConnector({ label, variant = 'default' }) {
  const lineClass = {
    default: 'from-[#E2004F]/40 to-slate-200',
    parallel: 'from-purple-400/50 to-indigo-300/50',
    decision: 'from-amber-400/50 to-orange-200/50',
  }[variant] || 'from-slate-200 to-slate-200';

  return (
    <div className="flex flex-col items-center py-0.5 w-full max-w-md mx-auto">
      <div className={`w-0.5 h-3 bg-gradient-to-b ${lineClass}`} />
      {label && (
        <span className="text-[9px] font-bold text-slate-500 my-0.5 px-2 py-0.5 bg-white rounded-full border border-[#EBE5D9] text-center leading-snug">
          {label}
        </span>
      )}
      <div className={`w-0.5 h-2 bg-gradient-to-b ${lineClass}`} />
    </div>
  );
}

function MiniFlowRow({ systems }) {
  if (!systems?.length) return null;
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap py-1.5 px-2 rounded-lg bg-[#FAF8F5] border border-[#EBE5D9]/80 mt-2">
      {systems.map((key, i) => {
        const meta = SYSTEM_META[key];
        if (!meta) return null;
        return (
          <React.Fragment key={key}>
            {i > 0 && <span className="text-slate-300 text-[10px] font-black">→</span>}
            <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${meta.pill}`}>
              {meta.icon}
              {meta.label}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function BlueprintNodeCard({ nodeId, viewMode, isActive, onSelect }) {
  const node = BLUEPRINT_NODES[nodeId];
  const data = node[viewMode];
  const meta = SYSTEM_META[nodeId] || SYSTEM_META.website;
  const stageLabel = node.stageLabels[viewMode];

  return (
    <button
      type="button"
      onClick={() => onSelect(nodeId)}
      className={`group w-full text-left rounded-xl border-2 transition-all duration-150 ${
        isActive
          ? 'border-[#E2004F] bg-white shadow-md ring-1 ring-[#E2004F]/15'
          : 'border-[#EBE5D9]/80 bg-white hover:border-[#E2004F]/40 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2 p-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 border"
          style={{
            backgroundColor: `${meta.accent}14`,
            borderColor: `${meta.accent}35`,
          }}
        >
          {node.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 mb-0.5">
            <span
              className="text-[8px] font-extrabold uppercase tracking-wider px-1 py-0.5 rounded"
              style={{ color: meta.accent, backgroundColor: `${meta.accent}12` }}
            >
              {stageLabel}
            </span>
            <span className={`inline-flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.5 rounded border ${meta.pill}`}>
              {meta.icon}
              {meta.label}
            </span>
          </div>
          <h4 className="text-xs font-extrabold text-[#222121] leading-snug truncate">{data.title}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{data.sub}</p>
        </div>
      </div>
    </button>
  );
}

function BlueprintNodeRail({ activeNode, setActiveNode }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 custom-scroll -mx-0.5 px-0.5">
      {NODE_ORDER.map((id) => {
        const n = BLUEPRINT_NODES[id];
        const meta = SYSTEM_META[id] || SYSTEM_META.website;
        const active = activeNode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveNode(id)}
            className={`shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-lg border-2 text-left transition-all ${
              active ? 'border-[#E2004F] bg-[#FFF0F3] shadow-sm' : 'border-[#EBE5D9] bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-sm">{n.emoji}</span>
            <span className="text-[10px] font-extrabold text-[#222121] whitespace-nowrap">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function BlueprintInspector({ nodeId, viewMode }) {
  if (!nodeId) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-[#FAF8F5] to-white border border-[#EBE5D9] p-5">
          <p className="text-2xl mb-2">🗺️</p>
          <h4 className="text-base font-extrabold text-[#222121]">Blueprint Inspector</h4>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Click any node in the flowchart to see full business rules, technical specs, key fields, and routing outcomes.
            Switch view mode above to change the narrative lens.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {NODE_ORDER.map((id) => {
            const n = BLUEPRINT_NODES[id];
            return (
              <div key={id} className="text-center p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9]">
                <span className="text-xl">{n.emoji}</span>
                <p className="text-[10px] font-bold text-slate-500 mt-1">{SYSTEM_META[id]?.label || id}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const node = BLUEPRINT_NODES[nodeId];
  const data = node[viewMode];
  const sysMeta = SYSTEM_META[nodeId] || SYSTEM_META.website;
  const modeMeta = VIEW_MODES.find((m) => m.id === viewMode);

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-start gap-2">
        <span className="text-xl">{node.emoji}</span>
        <div className="min-w-0">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#E2004F] bg-[#FFF0F3] px-1.5 py-0.5 rounded-full border border-[#FFD2DB]">
            {modeMeta?.icon} {modeMeta?.label} view
          </span>
          <h5 className="text-sm font-extrabold text-[#222121] mt-1 leading-snug">{data.inspectTitle}</h5>
        </div>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed">{data.inspectDesc}</p>

      <MiniFlowRow systems={node.systems} />

      {data.bullets?.length > 0 && (
        <div className="rounded-xl border border-[#EBE5D9] overflow-hidden">
          <div className="px-3 py-1.5 bg-[#FAF8F5] border-b border-[#EBE5D9] text-[10px] font-extrabold text-[#222121] flex items-center gap-1.5">
            <span>📋</span> Key details
          </div>
          <ul className="px-3 py-2 space-y-1 bg-white">
            {data.bullets.map((b) => (
              <li key={b} className="text-xs text-slate-600 flex gap-1.5 leading-snug">
                <span className="font-bold shrink-0" style={{ color: sysMeta.accent }}>→</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.fields?.length > 0 && (
        <div className="rounded-xl border border-[#EBE5D9] overflow-hidden">
          <div className="px-3 py-1.5 bg-indigo-50 border-b border-indigo-100 text-[10px] font-extrabold text-indigo-900 flex items-center gap-1.5">
            <span>🔑</span> Key fields
          </div>
          <div className="px-3 py-2 flex flex-wrap gap-1 bg-white">
            {data.fields.map((f) => (
              <code key={f} className="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">
                {f}
              </code>
            ))}
          </div>
        </div>
      )}

      {data.outcomes?.length > 0 && (
        <div className="rounded-xl border border-[#EBE5D9] overflow-hidden">
          <div className="px-3 py-1.5 bg-emerald-50 border-b border-emerald-100 text-[10px] font-extrabold text-emerald-900 flex items-center gap-1.5">
            <span>🎯</span> Routing outcomes
          </div>
          <ul className="px-3 py-2 space-y-1 bg-white">
            {data.outcomes.map((o) => (
              <li key={o} className="text-xs text-slate-600 flex gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function BlueprintLegend({ compact }) {
  const items = [
    { color: '#E2004F', label: 'Website' },
    { color: '#007C92', label: 'ZoomInfo' },
    { color: '#FF4500', label: 'Chili Piper' },
    { color: '#5C2D91', label: 'Marketo' },
    { color: '#00A1E0', label: 'Salesforce' },
    { color: '#004A8F', label: 'RingLead' },
  ];
  if (compact) {
    return (
      <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center py-1">
        {items.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4 pt-4 border-t border-[#EBE5D9]">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function BlueprintPanel({ viewMode, setViewMode, activeNode, setActiveNode, headerOffset = 112 }) {
  const linearNodes = NODE_ORDER.filter((id) => !PARALLEL_NODES.includes(id));
  const panelHeight = `calc(100vh - ${headerOffset + 20}px)`;

  return (
    <div
      className="flex flex-col min-h-0 animate-fadeIn text-left lg:overflow-hidden lg:h-[var(--bp-h)] lg:max-h-[var(--bp-h)]"
      style={{ '--bp-h': panelHeight }}
    >
      {/* Frozen top: title + view toggle + stage rail */}
      <div className="shrink-0 z-30 space-y-2 pb-2 bg-[#FFFDF9]">
        <section className="bg-gradient-to-br from-[#222121] via-[#2d2b2b] to-[#1a1919] text-white rounded-xl p-3 border border-[#333] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FFB3C7]">Visual Blueprint</span>
              <h2 className="text-base font-extrabold tracking-tight leading-tight">Inbound routing pipeline</h2>
            </div>
            <div className="flex rounded-lg bg-white/10 p-0.5 border border-white/15 shrink-0">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewMode(mode.id)}
                  title={mode.desc}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all whitespace-nowrap ${
                    viewMode === mode.id ? 'bg-[#E2004F] text-white shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {mode.icon} {mode.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <BlueprintNodeRail activeNode={activeNode} setActiveNode={setActiveNode} />
          </div>
        </section>
        <BlueprintLegend compact />
      </div>

      {/* Viewport-fit split: flow + inspector scroll internally */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 pt-1 overflow-hidden">
        {/* Flowchart timeline */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[#EBE5D9] rounded-xl p-3 shadow-sm flex flex-col min-h-0 overflow-hidden">
          <div className="shrink-0 flex items-center justify-between gap-2 pb-2 border-b border-[#EBE5D9]/80 mb-2">
            <h3 className="text-[10px] font-extrabold text-[#222121] uppercase tracking-wider">Pipeline flow</h3>
            <p className="text-[9px] text-slate-400">Tap a stage to inspect →</p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll pr-1">
            <div className="relative max-w-md mx-auto pb-1">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#E2004F]/30 via-purple-300/40 to-emerald-400/40 pointer-events-none" aria-hidden />

              <div className="space-y-0">
                {linearNodes.slice(0, 3).map((nodeId, idx) => (
                  <React.Fragment key={nodeId}>
                    {idx > 0 && (
                      <FlowConnector label={idx === 1 ? 'Enrichment feeds Concierge' : 'Eligible → book or abandon'} />
                    )}
                    <div className="relative pl-1">
                      <BlueprintNodeCard
                        nodeId={nodeId}
                        viewMode={viewMode}
                        isActive={activeNode === nodeId}
                        onSelect={setActiveNode}
                      />
                    </div>
                  </React.Fragment>
                ))}

                <FlowConnector label="Parallel backend sync" variant="parallel" />

                <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/40 p-2 space-y-1.5">
                  <p className="text-[9px] font-extrabold text-purple-700 uppercase tracking-wider text-center">Runs in parallel</p>
                  {PARALLEL_NODES.map((nodeId) => (
                    <BlueprintNodeCard
                      key={nodeId}
                      nodeId={nodeId}
                      viewMode={viewMode}
                      isActive={activeNode === nodeId}
                      onSelect={setActiveNode}
                    />
                  ))}
                </div>

                <FlowConnector label="MQL + dedupe → Distro" />

                <BlueprintNodeCard
                  nodeId="distro"
                  viewMode={viewMode}
                  isActive={activeNode === 'distro'}
                  onSelect={setActiveNode}
                />

                <div className="mt-2 space-y-1.5">
                  <div className="p-2 rounded-lg border-2 border-dashed border-[#FFD2DB] bg-[#FFF0F3]/60 text-center">
                    <p className="text-[9px] font-extrabold text-[#E2004F] uppercase">No rule match</p>
                    <p className="text-[10px] font-bold text-[#222121] mt-0.5">⊘ Catch-All → MOPS review</p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                    <span className="text-base">🤝</span>
                    <div className="text-left min-w-0">
                      <p className="text-[10px] font-extrabold text-emerald-900">Post-call Handoff</p>
                      <p className="text-[9px] text-emerald-700 leading-snug">XDR → AE via Pod pairings · RevOps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inspector — frozen header, scrollable body */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-[#EBE5D9] rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden">
          <div className="shrink-0 px-3 py-2 border-b border-[#EBE5D9] bg-gradient-to-r from-[#FFF0F3]/50 to-white">
            <h4 className="text-[10px] font-extrabold text-[#E2004F] uppercase tracking-wider">
              Blueprint Inspector
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
              {activeNode ? `Inspecting ${SYSTEM_META[activeNode]?.label || activeNode}` : 'Select a pipeline stage'}
            </p>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll px-3 py-2">
            <BlueprintInspector nodeId={activeNode} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}

window.BlueprintPanel = BlueprintPanel;
