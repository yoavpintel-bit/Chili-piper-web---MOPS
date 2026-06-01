/* global React */
const { useState, useMemo } = React;

function primaryScenarioId(scenarioText) {
  const matches = [...String(scenarioText || '').matchAll(/Scenario ([A-I])/gi)];
  return matches.length ? matches[matches.length - 1][1].toUpperCase() : null;
}

function evaluateLeadSimulation(input) {
  const {
    email = '',
    formType = 'RAD',
    zoominfo = 'success',
    employees = 350,
    isExclusion = 'no',
    sfdcOwner = 'no_owner',
    booksMeeting = 'yes',
    ringLead = 'pass',
    distroRule = 'match',
  } = input;

  if (email.includes('test') || email.includes('qa')) {
    return {
      scenario: 'QA/Test Route',
      type: 'Test Allowlist',
      desc: 'Internal QA email detected — specialized QA calendar shown.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      flow: ['Form submitted', 'ZoomInfo triggered', 'QA allowlist match', 'QA calendar shown'],
      systems: ['website', 'concierge'],
    };
  }
  if (isExclusion === 'yes') {
    return {
      scenario: 'Scenario F: Excluded account',
      type: 'Exclusion match',
      desc: 'Customer/churn exclusion — no live calendar. Logged in Marketo/SFDC only.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      flow: ['Form submitted', 'Exclusion flag matched', 'Marketo sync', 'No Concierge calendar'],
      systems: ['website', 'marketo', 'salesforce'],
    };
  }
  if (sfdcOwner === 'has_owner') {
    return {
      scenario: 'Scenario E: Existing owner',
      type: 'Owner override',
      desc: 'Active Salesforce owner found — round-robin bypassed, routes to that rep.',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      flow: ['Form submitted', 'Enrichment complete', 'Ownership match', 'Direct to owner calendar'],
      systems: ['website', 'concierge', 'salesforce'],
    };
  }
  if (zoominfo === 'failed') {
    if (employees >= 20 && employees <= 8000) {
      if (booksMeeting === 'yes') {
        return {
          scenario: 'Scenario D → A (manual fallback, booked)',
          type: 'Partial enrichment',
          desc: 'ZoomInfo failed; 2nd form captured employees. User booked Disco Call.',
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          flow: ['Form submitted', 'Enrichment failed', '2nd form shown', 'Manual input valid', 'Concierge live', 'Meeting booked'],
          systems: ['website', 'second_form', 'concierge', 'marketo', 'salesforce'],
        };
      }
      return {
        scenario: 'Scenario D → B (manual, abandoned)',
        type: 'Unbooked qualified',
        desc: 'Manual fallback worked but user left without booking → Distro backend.',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        flow: ['Form submitted', 'Enrichment failed', '2nd form', 'Concierge shown', 'Abandoned', 'Marketo MQL', 'RingLead pass', 'Distro assign'],
        systems: ['website', 'second_form', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro'],
      };
    }
    return {
      scenario: 'Scenario D → C (ineligible fallback)',
      type: 'Out of band',
      desc: 'Enrichment failed; manual count outside 20–8K — no live calendar.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      flow: ['Form submitted', 'Enrichment failed', '2nd form', 'Size out of range', 'Marketo only', 'Distro backend'],
      systems: ['website', 'second_form', 'marketo', 'salesforce', 'ringlead', 'distro'],
    };
  }
  if (employees < 20 || employees > 8000) {
    if (ringLead === 'fail') {
      return {
        scenario: 'Scenario C → G',
        type: 'RingLead blocked',
        desc: 'Out of band + RingLead dedupe fail — manual MOPS review.',
        badgeColor: 'bg-red-100 text-red-800 border-red-300',
        flow: ['Form submitted', 'Enriched out of range', 'No calendar', 'Marketo MQL', 'RingLead fail', 'Assignment blocked'],
        systems: ['website', 'marketo', 'salesforce', 'ringlead'],
      };
    }
    if (distroRule === 'no_match') {
      return {
        scenario: 'Scenario C → H (Catch-All)',
        type: 'Distro gap',
        desc: 'No live calendar; Distro found no matching rule → Catch-All.',
        badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        flow: ['Form submitted', 'Out of range', 'No calendar', 'Marketo MQL', 'RingLead pass', 'Distro: no rule', 'Catch-All'],
        systems: ['website', 'marketo', 'salesforce', 'ringlead', 'distro'],
      };
    }
    return {
      scenario: 'Scenario C: Backend Distro',
      type: 'Silent assign',
      desc: 'Not eligible for live book — Marketo + RingLead + Distro assign silently.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      flow: ['Form submitted', 'Enriched out of range', 'No calendar', 'Marketo MQL', 'RingLead pass', 'Distro Strict RR'],
      systems: ['website', 'marketo', 'salesforce', 'ringlead', 'distro'],
    };
  }
  if (booksMeeting === 'yes') {
    return {
      scenario: 'Scenario A: Gold path',
      type: 'Booked live',
      desc: 'Enriched, qualified, booked Disco Call on Concierge — perfect inbound path.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      flow: ['Form submitted', 'ZoomInfo enriched', 'Concierge live', 'Segment matched', 'Disco Call booked', 'SFDC Activity created'],
      systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce'],
    };
  }
  if (ringLead === 'fail') {
    return {
      scenario: 'Scenario B → G',
      type: 'RingLead blocked',
      desc: 'Qualified but unbooked; RingLead blocks backend assignment.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      flow: ['Form submitted', 'Enriched', 'Concierge abandoned', 'Marketo MQL', 'RingLead fail', 'Manual review'],
      systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead'],
    };
  }
  if (distroRule === 'no_match') {
    return {
      scenario: 'Scenario B → H (Catch-All)',
      type: 'Distro Catch-All',
      desc: 'Qualified, abandoned calendar, Distro has no segment match.',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
      flow: ['Form submitted', 'Enriched', 'Concierge abandoned', 'Marketo MQL', 'RingLead pass', 'Distro: no rule', 'Catch-All'],
      systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro'],
    };
  }
  return {
    scenario: 'Scenario B: Backend assigned',
    type: 'Silent Distro',
    desc: 'Qualified lead abandoned calendar — Distro assigns via Strict Round-Robin.',
    badgeColor: 'bg-violet-100 text-violet-800 border-violet-300',
    flow: ['Form submitted', 'Enriched', 'Concierge abandoned', 'Marketo MQL', 'RingLead pass', 'Distro assigned'],
    systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro'],
  };
}

const SYSTEM_LABELS = {
  website: '🌐 Website',
  zoominfo: '🔍 ZoomInfo',
  second_form: '📝 2nd form',
  concierge: '🌶️ Concierge',
  marketo: '📣 Marketo',
  salesforce: '☁️ Salesforce',
  ringlead: '🔗 RingLead',
  distro: '⚙️ Distro',
};

function RevealCard({ title, body, stepLabel, isLatest }) {
  return (
    <div
      className={`relative pl-9 pb-1 animate-fadeIn ${isLatest ? 'pb-4' : ''}`}
    >
      <div
        className={`absolute left-[11px] top-8 bottom-0 w-0.5 ${
          isLatest ? 'bg-[#E2004F]/30' : 'bg-emerald-200'
        }`}
        aria-hidden
      />
      <div
        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
          isLatest
            ? 'bg-[#E2004F] text-white shadow-md ring-4 ring-[#FFF0F3]'
            : 'bg-white text-emerald-700 border-2 border-emerald-300'
        }`}
      >
        {isLatest ? '●' : '✓'}
      </div>
      <div
        className={`rounded-2xl p-4 border ${
          isLatest
            ? 'bg-[#FFF0F3] border-[#FFD2DB] shadow-sm'
            : 'bg-emerald-50/80 border-emerald-200'
        }`}
      >
        {stepLabel && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stepLabel}</p>
        )}
        <p className={`text-sm font-extrabold ${isLatest ? 'text-[#E2004F]' : 'text-emerald-900'}`}>{title}</p>
        <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">{body}</p>
        {isLatest && (
          <span className="inline-block mt-2 text-[10px] font-bold text-[#E2004F] bg-white px-2 py-0.5 rounded-full border border-[#FFD2DB]">
            Latest
          </span>
        )}
      </div>
    </div>
  );
}

function ScenarioResultLink({ finalResult, onOpenScenario }) {
  const scenarioId = primaryScenarioId(finalResult?.scenario);
  if (!scenarioId || typeof onOpenScenario !== 'function') return null;
  return (
    <button
      type="button"
      onClick={() => onOpenScenario(scenarioId)}
      className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#E2004F] bg-[#FFF0F3] border border-[#FFD2DB] px-4 py-2 rounded-xl hover:bg-white transition-colors"
    >
      Read full Scenario {scenarioId} in Outcomes &amp; rules →
    </button>
  );
}

function ScenarioGamePanel({ FormattedText, onOpenScenario }) {
  const timelineRef = React.useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({
    email: 'prospect@acme.com',
    formType: 'RAD',
    zoominfo: 'success',
    employees: 350,
    isExclusion: 'no',
    sfdcOwner: 'no_owner',
    booksMeeting: 'yes',
    ringLead: 'pass',
    distroRule: 'match',
  });
  const [timeline, setTimeline] = useState([]);

  const eligibleForCalendar = answers.employees >= 20 && answers.employees <= 8000
    && answers.isExclusion === 'no' && answers.sfdcOwner === 'no_owner';

  const needsBackend = eligibleForCalendar && answers.booksMeeting === 'no';

  const questions = useMemo(() => {
    const q = [
      {
        id: 'email',
        title: 'Step 1 · The handraiser arrives',
        question: 'What business email did they enter?',
        type: 'text',
        key: 'email',
        reveal: (a) => ({
          title: 'Form captured',
          body: `Email ${a.email} submitted on HiBob. Domain extracted on focus-out. Payload sent to Marketo in parallel — every lead is logged, no exceptions.`,
        }),
      },
      {
        id: 'form',
        title: 'Step 2 · Which form?',
        question: 'Which high-intent form did they submit?',
        type: 'choice',
        key: 'formType',
        options: [
          { value: 'RAD', label: 'Request a Demo (RAD)' },
          { value: 'WAD', label: 'Watch a Demo (WAD)' },
          { value: 'Pricing', label: 'Pricing page' },
          { value: 'Tour', label: 'Product tour' },
          { value: 'Contact', label: 'Contact us' },
        ],
        reveal: (a) => ({
          title: `${a.formType} form accepted`,
          body: 'Approved high-intent form — Concierge eligibility checks will run after enrichment. Marketo scoring starts immediately.',
        }),
      },
      {
        id: 'enrichment',
        title: 'Step 3 · Enrichment',
        question: 'Did ZoomInfo enrichment return firmographics?',
        type: 'choice',
        key: 'zoominfo',
        options: [
          { value: 'success', label: 'Yes — country, state & employees returned' },
          { value: 'failed', label: 'No — empty or timed out' },
        ],
        reveal: (a) => a.zoominfo === 'success'
          ? { title: 'ZoomInfo success', body: 'HQ country, state, and employee count populated routing fields (cb_company_employees__c). Concierge segment rules can evaluate.' }
          : { title: 'Enrichment failed', body: 'Dynamic 2nd-step form appears asking for Title, Company, and Employee count. Manual input is lowest-priority fallback data.' },
      },
      {
        id: 'employees',
        title: 'Step 4 · Company size',
        question: 'How many employees does the company have?',
        type: 'number',
        key: 'employees',
        reveal: (a) => {
          const n = Number(a.employees);
          if (n >= 20 && n <= 8000) {
            return { title: 'Live-booking band (20–8K)', body: `${n} employees — eligible for on-page Chili Piper Concierge calendar (Disco Call only).` };
          }
          return { title: 'Outside live-booking band', body: `${n} employees — no live calendar. Lead continues to Marketo + backend Distro path.` };
        },
      },
      {
        id: 'exclusion',
        title: 'Step 5 · Exclusions',
        question: 'Is this a customer, churn, or excluded account?',
        type: 'choice',
        key: 'isExclusion',
        options: [
          { value: 'no', label: 'No — net-new prospect' },
          { value: 'yes', label: 'Yes — customer / churn / exclusion list' },
        ],
        reveal: (a) => a.isExclusion === 'yes'
          ? { title: 'Excluded', body: 'No Concierge calendar. Lead logged in Marketo/SFDC for nurture or ops review.' }
          : { title: 'Clear to route', body: 'Spam, QA, and exclusion checks passed. Proceeding to ownership + calendar gate.' },
      },
      {
        id: 'owner',
        title: 'Step 6 · Salesforce ownership',
        question: 'Does Salesforce show an active account owner?',
        type: 'choice',
        key: 'sfdcOwner',
        options: [
          { value: 'no_owner', label: 'No active owner' },
          { value: 'has_owner', label: 'Yes — active owner on Ownership team' },
        ],
        reveal: (a) => a.sfdcOwner === 'has_owner'
          ? { title: 'Owner override (Scenario E)', body: 'Round-robin bypassed — calendar routes directly to the existing rep.' }
          : { title: 'No owner match', body: 'Standard Concierge segment rules + Flexible Round-Robin apply.' },
      },
    ];
    if (eligibleForCalendar && answers.isExclusion === 'no' && answers.sfdcOwner === 'no_owner') {
      q.push({
        id: 'book',
        title: 'Step 7 · Live booking',
        question: 'Did the prospect book a meeting on the Concierge calendar?',
        type: 'choice',
        key: 'booksMeeting',
        options: [
          { value: 'yes', label: 'Yes — picked a Disco Call slot' },
          { value: 'no', label: 'No — closed or abandoned the calendar' },
        ],
        reveal: (a) => a.booksMeeting === 'yes'
          ? { title: 'Gold path (Scenario A)', body: 'Meeting booked! Booking_Status_CP__c = Booked, Meeting_Type_CP__c = Disco Call. Account marked Prospect in SFDC.' }
          : { title: 'Calendar abandoned (Scenario B path)', body: 'Qualified but unbooked — backend Marketo MQL + RingLead + Distro path activates silently.' },
      });
    }
    if (needsBackend || (!eligibleForCalendar && answers.isExclusion === 'no')) {
      q.push({
        id: 'ringlead',
        title: 'Step 8 · RingLead dedupe',
        question: 'Did RingLead deduplication pass?',
        type: 'choice',
        key: 'ringLead',
        options: [
          { value: 'pass', label: 'Pass — clean match' },
          { value: 'fail', label: 'Fail — duplicate flagged (Scenario G)' },
        ],
        reveal: (a) => a.ringLead === 'pass'
          ? { title: 'RingLead pass', body: 'Clean CRM record — Distro backend assignment can proceed.' }
          : { title: 'RingLead blocked', body: 'Distro assignment halted. Account queues for MOPS manual review.' },
      });
    }
    if ((needsBackend || !eligibleForCalendar) && answers.ringLead !== 'fail') {
      q.push({
        id: 'distro',
        title: 'Step 9 · Distro routing',
        question: 'Did Distro find a matching segment rule?',
        type: 'choice',
        key: 'distroRule',
        options: [
          { value: 'match', label: 'Yes — Strict Round-Robin assigned a rep' },
          { value: 'no_match', label: 'No match → Catch-All (Scenario F)' },
        ],
        reveal: (a) => a.distroRule === 'match'
          ? { title: 'Distro assigned', body: 'Priority Account assigned silently via Strict Round-Robin by region + employee band.' }
          : { title: 'Catch-All', body: 'No active segment rule matched. MOPS reviews in Catch-All dashboard.' },
      });
    }
    return q;
  }, [answers, eligibleForCalendar, needsBackend]);

  const currentQ = questions[stepIndex];
  const finalResult = useMemo(() => evaluateLeadSimulation(answers), [answers]);
  const isComplete = stepIndex >= questions.length;

  const pushTimeline = (entry) => {
    setTimeline((prev) => [{ ...entry, id: Date.now() + Math.random() }, ...prev]);
  };

  React.useEffect(() => {
    if (timelineRef.current) timelineRef.current.scrollTop = 0;
  }, [timeline.length]);

  const advance = (reveal) => {
    if (reveal) {
      pushTimeline({ type: 'reveal', ...reveal, step: currentQ?.title });
    }
    setStepIndex((i) => i + 1);
  };

  const handleChoice = (value) => {
    const next = { ...answers, [currentQ.key]: currentQ.type === 'number' ? Number(value) : value };
    setAnswers(next);
    const reveal = currentQ.reveal({ ...next, [currentQ.key]: currentQ.type === 'number' ? Number(value) : value });
    advance(reveal);
  };

  const reset = () => {
    setStepIndex(0);
    setTimeline([]);
    setAnswers({
      email: 'prospect@acme.com',
      formType: 'RAD',
      zoominfo: 'success',
      employees: 350,
      isExclusion: 'no',
      sfdcOwner: 'no_owner',
      booksMeeting: 'yes',
      ringLead: 'pass',
      distroRule: 'match',
    });
  };

  return (
    <div className="flex flex-col lg:max-h-[calc(100vh-7rem)] min-h-0 animate-fadeIn text-left">
      <section className="shrink-0 bg-gradient-to-br from-[#222121] to-[#2d2b2b] text-white rounded-2xl p-4 md:p-5 border border-[#333] mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFB3C7]">Routing game</span>
            <h2 className="text-lg md:text-xl font-extrabold mt-1">Walk a lead through the pipeline</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl hidden sm:block">
              Answer one question at a time — see what happened before moving on.
            </p>
          </div>
          <div className="flex items-center gap-2 min-w-[140px] flex-1 sm:flex-none sm:w-40">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E2004F] transition-all duration-300"
                style={{ width: `${Math.min(100, ((stepIndex) / Math.max(questions.length, 1)) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 tabular-nums">
              {Math.min(stepIndex + 1, questions.length)}/{questions.length}
            </span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 lg:overflow-hidden">
        <div className="lg:col-span-5 min-h-0 lg:overflow-y-auto custom-scroll lg:pr-1 space-y-3">
          {!isComplete && currentQ && (
            <div className="bg-white border-2 border-[#E2004F] rounded-3xl p-6 shadow-lg">
              <p className="text-[11px] font-extrabold text-[#E2004F] uppercase tracking-wider">{currentQ.title}</p>
              <h3 className="text-lg font-extrabold text-[#222121] mt-2">{currentQ.question}</h3>

              {currentQ.type === 'text' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="email"
                    value={answers.email}
                    onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                    className="w-full border border-[#EBE5D9] rounded-xl px-4 py-3 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleChoice(answers.email)}
                    className="w-full bg-[#E2004F] text-white font-bold py-3 rounded-xl hover:bg-[#c40044]"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {currentQ.type === 'number' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="number"
                    value={answers.employees}
                    onChange={(e) => setAnswers({ ...answers, employees: Number(e.target.value) })}
                    className="w-full border border-[#EBE5D9] rounded-xl px-4 py-3 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleChoice(answers.employees)}
                    className="w-full bg-[#E2004F] text-white font-bold py-3 rounded-xl"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {currentQ.type === 'choice' && (
                <div className="mt-4 space-y-2">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChoice(opt.value)}
                      className="w-full text-left px-4 py-3 rounded-xl border border-[#EBE5D9] hover:border-[#E2004F] hover:bg-[#FFF0F3] text-sm font-semibold transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isComplete && (
            <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6">
              <p className="text-xs font-extrabold text-emerald-700 uppercase">Journey complete</p>
              <h3 className="text-xl font-extrabold text-[#222121] mt-2">{finalResult.scenario}</h3>
              <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border ${finalResult.badgeColor}`}>
                {finalResult.type}
              </span>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{finalResult.desc}</p>
              <ScenarioResultLink finalResult={finalResult} onOpenScenario={onOpenScenario} />
              <button type="button" onClick={reset} className="mt-4 block text-sm font-bold text-[#E2004F] underline">
                Play again
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-7 flex flex-col min-h-0 lg:max-h-[calc(100vh-11rem)] lg:overflow-hidden">
          <div className="flex items-center justify-between shrink-0 mb-2 px-0.5">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              What happened so far
            </h4>
            {timeline.length > 0 && (
              <span className="text-[10px] font-bold text-[#E2004F] bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#FFD2DB]">
                Newest first ↑
              </span>
            )}
          </div>
          <div
            ref={timelineRef}
            className="flex-1 min-h-0 overflow-y-auto custom-scroll pr-0 lg:pr-1"
          >
          {timeline.length === 0 && !isComplete && (
            <p className="text-sm text-slate-400 bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-6">
              Your routing story builds here as you answer each question…
            </p>
          )}
          {timeline.length > 0 && (
            <div className="pt-1">
              {timeline.map((item, i) => (
                <RevealCard
                  key={item.id || i}
                  title={item.title}
                  body={item.body}
                  stepLabel={item.step}
                  isLatest={i === 0}
                />
              ))}
            </div>
          )}

          {isComplete && (
            <div className="mt-4 space-y-3 border-t border-[#EBE5D9] pt-4">
              <div className="bg-gradient-to-br from-[#222121] to-[#2d2b2b] text-white rounded-2xl p-5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFB3C7]">Final outcome</p>
                <h3 className="text-lg font-extrabold mt-1">{finalResult.scenario}</h3>
                <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full border ${finalResult.badgeColor}`}>
                  {finalResult.type}
                </span>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">{finalResult.desc}</p>
                <ScenarioResultLink finalResult={finalResult} onOpenScenario={onOpenScenario} />
              </div>
              <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5">
                <p className="text-xs font-extrabold uppercase text-slate-500 mb-3">Full path trace</p>
                <ol className="space-y-2">
                  {finalResult.flow.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-[#E2004F] font-bold shrink-0">{i + 1}.</span>
                      {FormattedText ? <FormattedText text={line} /> : line}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-wrap gap-2">
                {finalResult.systems.map((s) => (
                  <span key={s} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#FFF0F3] border border-[#FFD2DB] text-[#E2004F]">
                    {SYSTEM_LABELS[s] || s}
                  </span>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScenarioGamePanel = ScenarioGamePanel;
window.evaluateLeadSimulation = evaluateLeadSimulation;
