    const { useState, useEffect, useRef, useMemo } = React;

    // High-fidelity vector SVGs representing system badges
    const BobIcon = () => (
      <svg className="w-3 h-3 text-[#E2004F] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    );

    const ChiliPiperIcon = () => (
      <svg className="w-3.5 h-3.5 text-[#FF4500] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C11.5 2 11 2.5 11 3C11 4.5 9.5 5.5 8 5.5C7.5 5.5 7 6 7 6.5C7 7.5 5.5 8.5 4 8.5C3.5 8.5 3 9 3 9.5C3 11 4.5 12 5.5 13.5C5.5 14 5 14.5 5 15C5 18.5 9 22 13 22C17 22 21 18.5 21 15C21 11.5 19 8.5 16 7C14.5 6 13.5 4.5 13 3C13 2.5 12.5 2 12 2Z" />
      </svg>
    );

    const SalesforceIcon = () => (
      <svg className="w-3.5 h-3.5 text-[#00A1E0] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" />
      </svg>
    );

    const MarketoIcon = () => (
      <svg className="w-3.5 h-3.5 text-[#5C2D91] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22h20L12 2zm0 4l6.5 13H5.5L12 6z" />
      </svg>
    );

    const ZoomInfoIcon = () => (
      <svg className="w-3.5 h-3.5 text-[#007C92] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    );

    const ClayIcon = () => (
      <svg className="w-3 h-3 text-[#333333] inline-block shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    );

    const RingLeadIcon = () => (
      <svg className="w-3.5 h-3.5 text-[#004A8F] inline-block shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    );

    const FormattedText = ({ text }) => {
      if (!text) return null;
      const regex = /(HiBob|Chili Piper|Marketo|Salesforce|RingLead|ZoomInfo|Clay)/g;
      const parts = text.split(regex);
      return (
        <span>
          {parts.map((part, index) => {
            if (part === 'HiBob') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-[#FFF0F3] border border-[#FFD2DB] text-[#E2004F] px-1.5 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <BobIcon />
                  <span>HiBob</span>
                </span>
              );
            }
            if (part === 'Chili Piper') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-1.5 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <ChiliPiperIcon />
                  <span>Chili Piper</span>
                </span>
              );
            }
            if (part === 'Marketo') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 px-1.5 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <MarketoIcon />
                  <span>Marketo</span>
                </span>
              );
            }
            if (part === 'Salesforce') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <SalesforceIcon />
                  <span>Salesforce</span>
                </span>
              );
            }
            if (part === 'RingLead') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 px-1.5 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <RingLeadIcon />
                  <span>RingLead</span>
                </span>
              );
            }
            if (part === 'ZoomInfo') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-200 text-cyan-700 px-1.5 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <ZoomInfoIcon />
                  <span>ZoomInfo</span>
                </span>
              );
            }
            if (part === 'Clay') {
              return (
                <span key={index} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded-lg font-extrabold text-[11px] mx-0.5 shadow-xs select-none">
                  <ClayIcon />
                  <span>Clay</span>
                </span>
              );
            }
            return part;
          })}
        </span>
      );
    };

    const JOURNEY_STEPS = [
      {
        id: 'step1',
        num: 1,
        title: 'User Fills Out a Form',
        simpleDesc: 'The journey begins when a prospect is interested in HiBob. They land on an approved high-intent page and submit a "Get a free demo" form with their name and business email.',
        businessRules: [
          'Only approved high-intent forms qualify (Request a Demo - RAD, Watch a Demo - WAD, Pricing, Product Tour, Contact Us).',
          'Rule of Iron: Every single submission goes directly to Marketo, regardless of company size or if they book a meeting. The website never filters leads out of Marketo.'
        ],
        techSpecs: [
          'Email focus-out triggers the extraction of the domain (e.g., extracting "hitest.io" from "yoav@hitest.io").',
          'The initial payload contains Business Email and Full Name to initiate instant background API calls.'
        ],
        visualState: 'form'
      },
      {
        id: 'step2',
        num: 2,
        title: 'Automatic Company Enrichment',
        simpleDesc: 'As soon as the user exits the email field, the website quietly searches for the company size and location details using ZoomInfo to see if they are a qualified business.',
        businessRules: [
          'If ZoomInfo fails or lacks data, the website dynamically presents a second manual step form asking for Job Title, Company Name, and Number of Employees.',
          'Manual input becomes the lowest-priority fallback data source for Chili Piper routing.'
        ],
        techSpecs: [
          'The website calls ZoomInfo API (planned to move to Clay in the future).',
          'Requested Data: HQ Country (CB_Company_Country__c), HQ State (cb_company_state__c), and Employee Count (cb_company_employees__c).'
        ],
        visualState: 'enrichment'
      },
      {
        id: 'step3',
        num: 3,
        title: 'Eligibility & Safety Checks',
        simpleDesc: 'Chili Piper checks if the submission is a spam test or an existing customer. If they already have an active sales representative assigned in Salesforce, they bypass standard round-robin routing!',
        businessRules: [
          'Only companies with 20 to 8,000 employees qualify for a live web calendar.',
          'Exclusions applied: Existing customers, active churn accounts, pending churn, and ignored domains bypass live booking.',
          'Ownership Check: If an active owner is found in Salesforce, they bypass round-robin and go straight to that owner.'
        ],
        techSpecs: [
          'Spam Checker analyzes suspicious patterns. QA Allowlist bypasses production rules to test calendars.',
          'Salesforce Domain Match is queried. Checks if Owner ID is part of the Chili Piper Ownership Team.'
        ],
        visualState: 'validation'
      },
      {
        id: 'step4',
        num: 4,
        title: 'The Live Booking Experience',
        simpleDesc: 'If the lead qualifies, a Chili Piper calendar pops up on screen instantly. The prospect selects a time that works for them, booking an initial discovery call.',
        businessRules: [
          'Uses Flexible Round-Robin logic (since the user gets to choose from multiple rep availabilities).',
          'The booked meeting strictly creates a "Disco Call" activity associated with the account. Demo Calls are never booked live from this website Concierge step.'
        ],
        techSpecs: [
          'Saves the session and matches the calendar owner.',
          'Pushes Salesforce Event activity with custom Chili Piper fields: Booking_Status_CP__c = "Booked", Meeting_Type_CP__c = "Disco Call" (strictly coded for discovery events).'
        ],
        visualState: 'calendar'
      },
      {
        id: 'step5',
        num: 5,
        title: 'Salesforce Duplication Checks',
        simpleDesc: 'Behind the scenes, the lead is qualified, structured, and synchronized. Salesforce triggers RingLead to make sure the company is not already registered.',
        businessRules: [
          'RingLead deduplication must pass before backend assignment can execute.',
          'If RingLead flags a duplicate, backend assignment is halted and queued for manual review.'
        ],
        techSpecs: [
          'Marketo filters bad domains, scores the lead, and creates Salesforce Lead/Contact/Account records.',
          'RingLead triggers matching algorithms to check existing accounts.'
        ],
        visualState: 'ringlead'
      },
      {
        id: 'step6',
        num: 6,
        title: 'Silent Backend Assignment',
        simpleDesc: 'If the prospect was eligible but closed the calendar without booking, Chili Piper Distro assigns them to a representative silently in the background.',
        businessRules: [
          'Uses Strict Round-Robin to assign ownership, ensuring fair lead distribution across reps.',
          'If Distro fails to find a matching region rule, the account falls into "Catch-All" and is reviewed manually by MOPS.'
        ],
        techSpecs: [
          'Triggers Distro API flow in Salesforce post-RingLead validation.',
          'Utilizes Region__c, Account_Employees__c, and state fields for backend routing.'
        ],
        visualState: 'distro'
      },
      {
        id: 'step7',
        num: 7,
        title: 'Representative Hand-off',
        simpleDesc: 'Once the initial call is done, the representative easily schedules the next deep-dive meeting with a senior Sales Executive in their dedicated team via Chili Piper.',
        businessRules: [
          'Handoff is strictly based on sales Pods (e.g., SDR to AE pairings), not region, state, or company size rules.',
          'The transfer is done manually by the rep from the Salesforce interface using suggested matches.'
        ],
        techSpecs: [
          'Launches Chili Piper Handoff module Chrome extension from the Salesforce Account record.',
          'Detects sales rep pod field and maps direct calendar assignments.'
        ],
        visualState: 'handoff'
      }
    ];

    const SCENARIOS = [
      {
        id: 'A',
        title: 'Scenario A: Enriched Lead Qualifies & Books (Gold Path)',
        description: 'The ideal inbound experience. Prospect is enriched successfully, fits the 20-8,000 employee threshold, passes validations, and books a live calendar slot.',
        systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce'],
        steps: [
          'Prospect submits an approved high-intent form.',
          'ZoomInfo successfully enriches the domain with HQ location and employee count (e.g., 350 employees).',
          'Payload is immediately sent to Marketo in parallel.',
          'Chili Piper Concierge runs Spam, Test Allowlist, Owner Match, and Customer Exclusion checks.',
          'No pre-existing owner is found in CRM; segment rule matches and triggers the live round-robin calendar.',
          'Prospect selects a slot and books a "Disco Call".',
          'Marketo creates/updates records in Salesforce. CP saves the activity (Booking_Status_CP__c = "Booked", Meeting_Type_CP__c = "Disco Call").',
          'Salesforce Account status transitions automatically to "Prospect".'
        ]
      },
      {
        id: 'B',
        title: 'Scenario B: Lead Qualifies but Abandons Calendar',
        description: 'Prospect qualifies for live booking and is shown the calendar, but leaves the site without choosing a time. Backend routing takes over.',
        systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro'],
        steps: [
          'Prospect fills the approved form and qualifies for the calendar (20-8,000 employees).',
          'The live calendar is presented on screen, but the user closes the page.',
          'No Chili Piper activity is created at this moment.',
          'Marketo continues processing and scoring the lead. Once MQL conditions are met, a Priority Unassigned Account is created.',
          'Salesforce triggers RingLead for database deduplication and account matching.',
          'RingLead passes the check, invoking Chili Piper Distro in the backend.',
          'Distro assigns the owner based on strict round-robin rules.'
        ]
      },
      {
        id: 'C',
        title: 'Scenario C: Lead Ineligible for Calendar (Backend Route)',
        description: 'Lead is outside the 20-8,000 range (e.g., small business < 20 or enterprise > 8,000) or lacks reliable data. They bypass Concierge and route purely via backend.',
        systems: ['website', 'zoominfo', 'marketo', 'salesforce', 'ringlead', 'distro'],
        steps: [
          'Prospect submits form. ZoomInfo enriches company with < 20 or > 8,000 employees.',
          'Chili Piper Concierge calendar is withheld from the UI to protect rep calendars.',
          'Lead is processed solely by Marketo, enriched, and scored.',
          'If the lead qualifies as an MQL, Salesforce triggers RingLead deduplication.',
          'If RingLead passes, Chili Piper Distro assigns the unassigned Priority account via strict round-robin backend rules.'
        ]
      },
      {
        id: 'D',
        title: 'Scenario D: Enrichment Fails (Manual 2nd Step Form)',
        description: 'ZoomInfo cannot enrich the domain, prompting the website to dynamically show a second manual form to capture routing metrics.',
        systems: ['website', 'zoominfo', 'second_form', 'concierge', 'marketo'],
        steps: [
          'Prospect enters business email and exits the field.',
          'ZoomInfo API call fails or returns incomplete employee size/country information.',
          'The website dynamic form displays a 2nd step requesting Title, Company Name, and Number of Employees.',
          'Prospect manually fills the second form.',
          'If manually provided employee count is 20-8,000, Chili Piper Concierge is triggered using form-fill fallback data. If not, it falls back to Marketo-only routing.'
        ]
      },
      {
        id: 'E',
        title: 'Scenario E: Existing Salesforce Owner Found',
        description: 'A lead with an existing account owner submits a form. Chili Piper routes the meeting directly to the assigned rep.',
        systems: ['website', 'zoominfo', 'concierge', 'salesforce'],
        steps: [
          'Prospect submits form. Chili Piper checks existing Salesforce records by email domain.',
          'Salesforce returns a matching Account and its active Owner.',
          'Chili Piper verifies the owner is active in the Chili Piper Ownership team.',
          'Concierge routes the lead directly to this existing owner’s calendar, skipping standard round-robin to preserve relationships.'
        ]
      },
      {
        id: 'F',
        title: 'Scenario F: Concierge Has No Match (Catch-All)',
        description: 'The lead passes validations, but region, state, or employee metrics do not match any active routing segment rules.',
        systems: ['website', 'zoominfo', 'concierge', 'marketo'],
        steps: [
          'Lead enters Concierge. Spam, Test, and Exclusion checks run.',
          'Segment routing rules are evaluated against Region/Employees/State, but no active rule matches.',
          'Lead falls into Catch-All. No live calendar is shown.',
          'Lead continues processing in Marketo. If qualified as MQL, it is reviewed by MOPS manually via Catch-All lists.'
        ]
      },
      {
        id: 'G',
        title: 'Scenario G: RingLead Deduplication Fails',
        description: 'Backend assignment fails before reaching Distro due to strict RingLead database matching rules.',
        systems: ['website', 'marketo', 'salesforce', 'ringlead'],
        steps: [
          'Marketo creates/updates an MQL Account in Salesforce as Priority and Unassigned.',
          'Salesforce initiates the RingLead deduplication/matching step.',
          'RingLead flags a block, failed match, or exception.',
          'Chili Piper Distro is not triggered. The account remains unassigned and is flagged on the MOPS daily monitoring list.'
        ]
      },
      {
        id: 'H',
        title: 'Scenario H: Distro Has No Matching Assignment Rule',
        description: 'Salesforce calls Distro to route an unassigned account, but the account metrics match no active Distro rules.',
        systems: ['website', 'marketo', 'salesforce', 'ringlead', 'distro'],
        steps: [
          'Salesforce calls Chili Piper Distro for backend assignment.',
          'Distro checks Region, Employees, and State but finds no valid segment matching rule.',
          'The account is not assigned.',
          'Account falls into Catch-All. MOPS reviews and assigns manually.'
        ]
      },
      {
        id: 'I',
        title: 'Scenario I: Post-Discovery Manual Handoff',
        description: 'The discovery call is complete, and the SDR manually passes the account to the correct AE within their assigned Pod.',
        systems: ['salesforce', 'handoff'],
        steps: [
          'SDR completes the discovery call with the prospect.',
          'SDR opens the Account record in Salesforce and launches the Chili Piper Chrome extension.',
          'Chili Piper Handoff module detects the sales rep’s Pod from the Salesforce User profile.',
          'The Handoff window suggests the correct peer AEs within that Pod.',
          'SDR manually selects the AE and schedules/assigns the Handoff event.'
        ]
      }
    ];

    const FIELDS_REFERENCE = [
      { field: 'CB_Company_Country__c', source: 'Enrichment (ZoomInfo)', dest: 'Chili Piper / Salesforce', purpose: 'Company country used for primary region routing' },
      { field: 'cb_company_state__c', source: 'Enrichment (ZoomInfo)', dest: 'Chili Piper / Salesforce', purpose: 'Company state used for granular US state-level splits' },
      { field: 'cb_contact_state__c', source: 'Enrichment/IP Geo fallback', dest: 'Chili Piper', purpose: 'Fallback state when ZoomInfo lacks HQ state details' },
      { field: 'cb_company_employees__c', source: 'Enrichment (ZoomInfo)', dest: 'Chili Piper', purpose: 'Company employee count (Determines the 20-8,000 live booking eligibility)' },
      { field: 'web_form_name', source: 'Website Form', dest: 'Chili Piper', purpose: 'High-intent form type (RAD, WAD, Pricing, etc.)' },
      { field: 'NumberOfEmployees', source: 'Form Fill (Manual fallback)', dest: 'Chili Piper / Marketo', purpose: 'Employee count provided by user if enrichment fails' },
      { field: 'Company', source: 'Form Fill (Manual)', dest: 'Chili Piper / Marketo', purpose: 'Fallback company name if ZoomInfo fails' },
      { field: 'Country', source: 'IP Geo Location', dest: 'Chili Piper / Salesforce', purpose: 'Fallback country for routing if no enrichment exists' },
      { field: 'Email', source: 'Form Fill', dest: 'Chili Piper / Marketo', purpose: 'Primary domain extractor and unique identifier' },
      { field: 'Booking_Status_CP__c', source: 'Chili Piper Event', dest: 'Salesforce Activity', purpose: 'Set to "Booked" upon successful web booking' },
      { field: 'Meeting_Type_CP__c', source: 'Chili Piper Event', dest: 'Salesforce Activity', purpose: 'Strictly set to "Disco Call" for the initial inbound discovery meeting.' },
      { field: 'Queue_Name_CP__c', source: 'Chili Piper Router', dest: 'Salesforce Activity', purpose: 'Captures the specific Chili Piper queue assigned' },
      { field: 'Router_Name_CP__c', source: 'Chili Piper Router', dest: 'Salesforce Activity', purpose: 'Captures the Concierge or Distro router name' }
    ];

    function App() {
      const VALID_TABS = ['home', 'process', 'blueprint', 'simulator', 'playbook', 'fields', 'teams', 'operations'];
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const tabParam = params.get('tab');
      const initialTab = VALID_TABS.includes(tabParam) ? tabParam : 'home';
      const initialOpsDays = Number(params.get('days')) || 7;

      const [activeTab, setActiveTab] = useState(initialTab);
      const [opsDays, setOpsDays] = useState(initialOpsDays);

      const syncTabUrl = (tab, extra = {}) => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        if (tab === 'operations' && extra.days != null) {
          url.searchParams.set('days', String(extra.days));
        } else if (tab !== 'operations') {
          url.searchParams.delete('days');
        }
        window.history.replaceState({}, '', url);
      };

      const navigateToTab = (tab, extra = {}) => {
        if (!VALID_TABS.includes(tab)) return;
        setActiveTab(tab);
        if (tab === 'operations' && extra.days != null) setOpsDays(extra.days);
        syncTabUrl(tab, extra);
      };

      const goToCatchAllDashboard = (days = 7) => {
        navigateToTab('operations', { days });
      };
      const [selectedScenarioId, setSelectedScenarioId] = useState('A');
      const [activeStepId, setActiveStepId] = useState('step1');
      const [hoveredBlueprintNode, setHoveredBlueprintNode] = useState(null);
      
      // View mode for Visual Blueprint Map: 'business', 'technical', 'mixed'
      const [blueprintViewMode, setBlueprintViewMode] = useState('mixed');

      // Accordion status togglers per step for Business Rules (BR) and Tech Specs (TS)
      const [expandedBR, setExpandedBR] = useState({ step1: true, step2: false, step3: false, step4: false, step5: false, step6: false, step7: false });
      const [expandedTS, setExpandedTS] = useState({ step1: false, step2: false, step3: false, step4: false, step5: false, step6: false, step7: false });

      // Simulation State
      const [simFormType, setSimFormType] = useState('RAD');
      const [simEmail, setSimEmail] = useState('yoav@hitest.io');
      const [simZoominfo, setSimZoominfo] = useState('success');
      const [simEmployees, setSimEmployees] = useState(350);
      const [simIsExclusion, setSimIsExclusion] = useState('no');
      const [simSfdcOwner, setSimSfdcOwner] = useState('no_owner');
      const [simBooksMeeting, setSimBooksMeeting] = useState('yes');
      const [simRingLead, setSimRingLead] = useState('pass');
      const [simDistroRule, setSimDistroRule] = useState('match');

      const scrollContainerRef = useRef(null);
      const stepRefs = useRef({});

      // Lock current step logic into central container tracking (for iframes on Google Sites)
      useEffect(() => {
        if (activeTab !== 'process') return;

        const container = scrollContainerRef.current;
        if (!container) return;

        let ticking = false;

        const handleScroll = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const containerRect = container.getBoundingClientRect();
              const triggerPoint = containerRect.top + 160; 

              let currentActiveId = JOURNEY_STEPS.id;

              for (let i = 0; i < JOURNEY_STEPS.length; i++) {
                const step = JOURNEY_STEPS[i];
                const el = stepRefs.current[step.id];
                if (el) {
                  const rect = el.getBoundingClientRect();
                  // Check if the relative bottom of the card is still below our trigger threshold
                  if (rect.bottom - containerRect.top > 160) {
                    currentActiveId = step.id;
                    break;
                  }
                }
              }

              setActiveStepId(currentActiveId);
              ticking = false;
            });
            ticking = true;
          }
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => container.removeEventListener('scroll', handleScroll);
      }, [activeTab]);

      const scrollToStep = (id) => {
        const el = stepRefs.current[id];
        const container = scrollContainerRef.current;
        if (el && container) {
          const elRect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const targetScrollTop = container.scrollTop + (elRect.top - containerRect.top) - 16;
          
          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
          });
          setActiveStepId(id);
        }
      };

      const toggleBR = (id) => {
        setExpandedBR(prev => ({ ...prev, [id]: !prev[id] }));
      };

      const toggleTS = (id) => {
        setExpandedTS(prev => ({ ...prev, [id]: !prev[id] }));
      };

      // Live calculation for Scenario Playground
      const calculatedSimulationResult = useMemo(() => {
        if (simEmail.includes('test') || simEmail.includes('qa')) {
          return {
            scenario: 'QA/Test Route',
            type: 'Test Allowlist',
            desc: 'This lead is recognized as internal testing or QA. Chili Piper Concierge redirects to a specialized QA calendar.',
            badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
            flow: ['Form Submitted', 'ZoomInfo Triggered', 'Spam/Test Check: TEST DETECTED', 'QA Calendar Shown'],
            systems: ['website', 'concierge']
          };
        }

        if (simIsExclusion === 'yes') {
          return {
            scenario: 'Scenario F: Excluded Account (No Live Routing)',
            type: 'Exclusion Match',
            desc: 'Customer, Churn, or Not Relevant accounts are bypassed. No calendar is shown. Handled in Marketo/SFDC.',
            badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
            flow: ['Form Submitted', 'Exclusion Match: Customer/Churn detected', 'Parallel Marketo Flow', 'No Chili Piper Calendar'],
            systems: ['website', 'marketo', 'salesforce']
          };
        }

        if (simSfdcOwner === 'has_owner') {
          return {
            scenario: 'Scenario E: Existing Salesforce Owner Routed',
            type: 'Owner Override',
            desc: 'Salesforce contains a matching active account owner. The live routing engine bypasses round-robin and suggests the existing owner\'s calendar.',
            badgeColor: 'bg-teal-100 text-teal-700 border-teal-300',
            flow: ['Form Submitted', 'Enrichment Step', 'Ownership Check: MATCH FOUND', 'Direct Calendar Route'],
            systems: ['website', 'concierge', 'salesforce']
          };
        }

        if (simZoominfo === 'failed') {
          if (simEmployees >= 20 && simEmployees <= 8000) {
            if (simBooksMeeting === 'yes') {
              return {
                scenario: 'Scenario D ➡️ Scenario A (Manual Fallback & Booked)',
                type: 'Partial Enrichment Success',
                desc: 'ZoomInfo failed, triggering the 2nd form. The user manually entered valid employees (20-8000) and booked successfully.',
                badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300',
                flow: ['Form Submitted', 'Enrichment Failed', '2nd Step Form Displayed', 'Manual Input Validated', 'Chili Piper Concierge Live', 'Meeting Booked'],
                systems: ['website', 'second_form', 'concierge', 'marketo', 'salesforce']
              };
            } else {
              return {
                scenario: 'Scenario D ➡️ Scenario B (Manual Fallback, Not Booked)',
                type: 'Partial Enrichment Unbooked',
                desc: 'ZoomInfo failed, triggering the 2nd form. User entered valid employee range, saw the calendar, but closed the window without booking. Sent to Distro.',
                badgeColor: 'bg-sky-100 text-sky-700 border-sky-300',
                flow: ['Form Submitted', 'Enrichment Failed', '2nd Step Form Displayed', 'Manual Input Validated', 'Chili Piper Concierge Live', 'User Skipped Booking', 'Marketo MQL Created', 'RingLead Passed', 'Distro Strict Round-Robin'],
                systems: ['website', 'second_form', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro']
              };
            }
          } else {
            return {
              scenario: 'Scenario D ➡️ Scenario C (Ineligible Fallback)',
              type: 'Manual Input Out of Range',
              desc: 'ZoomInfo failed. User manually specified employee size outside the 20-8000 range. Bypassed Concierge directly to Marketo and Distro.',
              badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
              flow: ['Form Submitted', 'Enrichment Failed', '2nd Step Form Displayed', 'Manual Input: Ineligible Size', 'Parallel Marketo Flow', 'RingLead Step', 'Distro Strict Round-Robin'],
              systems: ['website', 'second_form', 'marketo', 'salesforce', 'ringlead', 'distro']
            };
          }
        }

        if (simEmployees < 20 || simEmployees > 8000) {
          if (simRingLead === 'fail') {
            return {
              scenario: 'Scenario C ➡️ Scenario G (Ineligible, RingLead Fails)',
              type: 'No Calendar & RingLead Blocked',
              desc: 'Employee count is out of range. No live calendar. Marketo creates Account but RingLead blocks assignment due to deduplication errors.',
              badgeColor: 'bg-red-100 text-red-700 border-red-300',
              flow: ['Form Submitted', 'Enrichment Success: Out of Range', 'No Calendar Shown', 'Parallel Marketo Flow', 'MQL Triggered', 'RingLead Steps: DETECTED DUPLICATE', 'Blocked: Account remains unassigned'],
              systems: ['website', 'marketo', 'salesforce', 'ringlead']
            };
          }
          if (simDistroRule === 'no_match') {
            return {
              scenario: 'Scenario C ➡️ Scenario H (Ineligible, Distro Catch-All)',
              type: 'No Calendar & Distro Catch-All',
              desc: 'Employee count is out of range. No live calendar. Backend Distro triggers but cannot match any active region rules, leaving it to MOPS monitoring.',
              badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-300',
              flow: ['Form Submitted', 'Enrichment Success: Out of Range', 'No Calendar Shown', 'Parallel Marketo Flow', 'MQL Triggered', 'RingLead Passed', 'Distro Routing: NO MATCHING RULE', 'Catch-All: Manual Review'],
              systems: ['website', 'marketo', 'salesforce', 'ringlead', 'distro']
            };
          }
          return {
            scenario: 'Scenario C: Ineligible Lead Routed via Backend Distro',
            type: 'Standard Backend Routing',
            desc: 'Lead is not eligible for live web calendar due to size. It gets processed by Marketo, passes RingLead, and is assigned by Distro backend round-robin.',
            badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
            flow: ['Form Submitted', 'Enrichment Success: Out of Range', 'No Calendar Shown', 'Parallel Marketo Flow', 'MQL Triggered', 'RingLead Passed', 'Distro Assigned (Strict Round-Robin)'],
            systems: ['website', 'marketo', 'salesforce', 'ringlead', 'distro']
          };
        }

        if (simBooksMeeting === 'yes') {
          return {
            scenario: 'Scenario A: Pure Inbound Gold Path (Enriched & Booked)',
            type: 'Perfect Live Match',
            desc: 'The gold standard RevOps scenario. The prospect gets enriched, passes spam/ownership checks, matches CP Concierge rules, and books the Disco Call.',
            badgeColor: 'bg-emerald-100 text-[#1F7A55] border-emerald-300',
            flow: ['Form Submitted', 'ZoomInfo Enriched (20-8000)', 'Chili Piper Concierge Live', 'Segment Rule Match', 'Calendar Chosen', 'Salesforce Activity Created', 'Account marked Prospect'],
            systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce']
          };
        } else {
          if (simRingLead === 'fail') {
            return {
              scenario: 'Scenario B ➡️ Scenario G (Unbooked & RingLead Blocked)',
              type: 'Failed Backend Sync',
              desc: 'Prospect qualifies but does not book. The backend fallback routing triggers, but RingLead fails to process matching rules.',
              badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
              flow: ['Form Submitted', 'ZoomInfo Enriched', 'Chili Piper Concierge Live', 'User Left Without Booking', 'Parallel Marketo Flow', 'RingLead Step: FAILURE', 'Blocked: Manual review required'],
              systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead']
            };
          }
          if (simDistroRule === 'no_match') {
            return {
              scenario: 'Scenario B ➡️ Scenario H (Unbooked & Distro Catch-All)',
              type: 'Failed Distro Segment Matching',
              desc: 'Prospect qualifies but does not book. The backend fallback routing triggers, passes RingLead, but Distro finds no matching territory rule.',
              badgeColor: 'bg-orange-100 text-orange-700 border-orange-300',
              flow: ['Form Submitted', 'ZoomInfo Enriched', 'Chili Piper Concierge Live', 'User Left Without Booking', 'Parallel Marketo Flow', 'RingLead Passed', 'Distro Steps: NO MATCH FOUND', 'Catch-All: Monitored by MOPS'],
              systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro']
            };
          }

          return {
            scenario: 'Scenario B: Enriched Lead Qualifies but Does Not Book',
            type: 'Backend Fallback Assigned',
            desc: 'Prospect qualifies but doesn\'t book online. Behind the scenes, Marketo, RingLead, and Chili Piper Distro successfully process the lead and assign it to the next rep in the round-robin.',
            badgeColor: 'bg-violet-100 text-violet-700 border-violet-300',
            flow: ['Form Submitted', 'ZoomInfo Enriched', 'Chili Piper Concierge Live', 'User Left Without Booking', 'Parallel Marketo Flow', 'RingLead Passed', 'Distro Rules Checked', 'Distro Assigned (Strict Round-Robin)'],
            systems: ['website', 'zoominfo', 'concierge', 'marketo', 'salesforce', 'ringlead', 'distro']
          };
        }
      }, [simEmail, simEmployees, simZoominfo, simIsExclusion, simSfdcOwner, simBooksMeeting, simRingLead, simDistroRule]);

      return (
        <div className="min-h-screen bg-[#FFFDF9] text-[#222121] font-sans antialiased selection:bg-[#FFF0F3] selection:text-[#E2004F]">
          
          {/* Bob Premium Header */}
          <header className="border-b border-[#F0EAE1] bg-white sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              
              {/* Logo Brand Area */}
              <div className="flex items-center space-x-3">
                <div className="bg-[#E2004F] p-2.5 rounded-2xl shadow-sm text-white flex items-center justify-center">
                  <BobIcon />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-extrabold text-[#222121] tracking-tight">hibob</span>
                    <span className="text-xs bg-[#FFF0F3] text-[#E2004F] font-bold px-2 py-0.5 rounded-full border border-[#FFD2DB]">
                      RevOps Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Chili Piper &amp; Marketo Integration Blueprint</p>
                </div>
              </div>
              
              {/* Main Navigation tabs - fully in English */}
              <div className="flex flex-wrap bg-[#F5F1E9] p-1 rounded-2xl border border-[#EBE5D9]">
                <button
                  onClick={() => navigateToTab('home')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'home'
                      ? 'bg-[#E2004F] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigateToTab('process')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'process'
                      ? 'bg-[#222121] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Interactive Story (Scroll)
                </button>
                <button
                  onClick={() => navigateToTab('blueprint')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'blueprint'
                      ? 'bg-[#222121] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Visual Blueprint Map
                </button>
                <button
                  onClick={() => navigateToTab('simulator')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'simulator'
                      ? 'bg-[#222121] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Scenario Playground
                </button>
                <button
                  onClick={() => navigateToTab('playbook')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'playbook'
                      ? 'bg-[#222121] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Technical Playbook
                </button>
                <button
                  onClick={() => navigateToTab('fields')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'fields'
                      ? 'bg-[#222121] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Field Mappings
                </button>
                <button
                  onClick={() => navigateToTab('teams')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'teams'
                      ? 'bg-[#222121] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Teams &amp; Countries
                </button>
                <button
                  data-tab-operations
                  onClick={() => goToCatchAllDashboard(7)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    activeTab === 'operations'
                      ? 'bg-[#E2004F] text-white shadow-sm'
                      : 'text-[#5A5755] hover:text-[#222121]'
                  }`}
                >
                  Catch-All Dashboard
                </button>
              </div>
            </div>
          </header>

          {/* Hero Banner Area (non-home, non-process tabs) */}
          {activeTab !== 'home' && activeTab !== 'process' && activeTab !== 'blueprint' && (
            <section className="bg-gradient-to-b from-white to-[#FFFDF9] py-8 border-b border-[#F0EAE1]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-xs font-extrabold text-[#E2004F] uppercase tracking-wider bg-[#FFF0F3] px-3.5 py-1.5 rounded-full border border-[#FFD2DB]">
                  HiBob RevOps · Chili Piper Hub
                </span>
                <h2 className="text-3xl font-extrabold text-[#222121] mt-4 tracking-tight leading-tight max-w-2xl mx-auto">
                  {activeTab === 'operations' ? 'Catch-All Operations' : 'Routing documentation'}
                </h2>
              </div>
            </section>
          )}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* TAB: HOME LANDING */}
            {activeTab === 'home' && window.HomePanel && (
              React.createElement(window.HomePanel, { onNavigateTab: navigateToTab })
            )}
            {activeTab === 'home' && !window.HomePanel && (
              <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 text-sm text-slate-500">Loading home…</div>
            )}
            
            {/* TAB 1: SCROLL STORYTELLER */}
            {activeTab === 'process' && (
              <div className="space-y-8 animate-fadeIn">
                {window.JourneyHero && React.createElement(window.JourneyHero, {
                  onStartJourney: () => scrollToStep('step1'),
                })}

                {/* Split Screen Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                  
                  {/* STICKY LEFT COLUMN: VISUAL PREVIEW SCREEN (5 COLS) */}
                  <div className="lg:col-span-5 sticky top-28 space-y-4">
                    
                    {/* Visual Sandbox Monitor Frame */}
                    <div className="bg-white border-4 border-[#222121] rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[560px] flex flex-col justify-between">
                      {/* Decorative System Header */}
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <div className="flex space-x-1.5">
                          <span className="w-3 h-3 rounded-full bg-rose-400" />
                          <span className="w-3 h-3 rounded-full bg-amber-400" />
                          <span className="w-3 h-3 rounded-full bg-emerald-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">HiBob Live Simulator</span>
                      </div>

                      {window.JourneyVisualMonitor ? (
                        React.createElement(window.JourneyVisualMonitor, {
                          activeStepId,
                          journeySteps: JOURNEY_STEPS,
                          onStepClick: scrollToStep,
                        })
                      ) : (
                        <p className="text-center text-slate-400 text-sm py-12">Loading journey visuals…</p>
                      )}
                    </div>

                    {/* Legend & Instructions */}
                    <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-5 text-sm space-y-2 text-left">
                      <div className="font-extrabold text-[#222121]">💡 How to use this tab</div>
                      <p className="text-slate-600 leading-relaxed">
                        Scroll the step cards on the right — each stage includes business rules, technical specs, and system tags.
                        The live simulator on the left updates automatically to match the active step.
                      </p>
                    </div>
                  </div>

                  {/* SCROLLABLE RIGHT COLUMN: STORY CARDS (7 COLS) */}
                  <div 
                    ref={scrollContainerRef}
                    className="lg:col-span-7 space-y-6 h-[680px] overflow-y-auto pr-3 custom-scroll text-left"
                  >
                    {window.JourneyStepCards ? (
                      React.createElement(window.JourneyStepCards, {
                        steps: JOURNEY_STEPS,
                        activeStepId,
                        stepRefs,
                        scrollToStep,
                        expandedBR,
                        expandedTS,
                        toggleBR,
                        toggleTS,
                        FormattedText,
                      })
                    ) : (
                      <p className="text-slate-400 text-sm py-8">Loading journey steps…</p>
                    )}

                  </div>

                  {/* STICKY CLICK-NAVIGATION BAR AT BOTTOM FOR ACCESSIBILITY */}
                  <div className="lg:col-span-12 bg-white border border-[#EBE5D9] p-3 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-xs font-bold gap-3 z-30">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Scroll Steps Quick-Jump:</span>
                    <div className="flex flex-wrap gap-1 justify-center flex-1">
                      {JOURNEY_STEPS.map((s, idx) => (
                        <button
                          key={s.id}
                          onClick={() => scrollToStep(s.id)}
                          className={`py-1 px-3 rounded-lg text-[11px] transition-all border ${
                            s.id === activeStepId
                              ? 'bg-[#E2004F] text-white border-[#E2004F] shadow-sm'
                              : 'bg-[#F5F1E9] text-slate-600 border-[#EBE5D9] hover:bg-white'
                          }`}
                        >
                          Step {s.num}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: VISUAL BLUEPRINT MAP */}
            {activeTab === 'blueprint' && window.BlueprintPanel && (
              React.createElement(window.BlueprintPanel, {
                viewMode: blueprintViewMode,
                setViewMode: setBlueprintViewMode,
                activeNode: hoveredBlueprintNode,
                setActiveNode: setHoveredBlueprintNode,
              })
            )}
            {activeTab === 'blueprint' && !window.BlueprintPanel && (
              <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 text-sm text-slate-500">Loading blueprint…</div>
            )}

            {/* TAB 3: SCENARIO PLAYGROUND / SIMULATOR */}
            {activeTab === 'simulator' && (
              <div className="space-y-8 animate-fadeIn text-left">
                <div className="bg-[#FAF8F5] border border-[#EBE5D9] p-5 rounded-3xl relative overflow-hidden">
                  <div className="max-w-2xl mb-6">
                    <span className="text-[10px] font-extrabold text-[#E2004F] bg-[#FFF0F3] px-3 py-1 rounded-full border border-[#FFD2DB] uppercase tracking-wider">Sandbox Simulator</span>
                    <h3 className="text-xl font-extrabold text-[#222121] mt-3">Interactive Logic Playground</h3>
                    <p className="text-xs text-slate-500 mt-1">Adjust the parameters below to preview how a lead flows through the platform. The systems checklist will dynamically highlight which systems are engaged!</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Simulator Control board (5 Cols) */}
                    <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#EBE5D9] space-y-4">
                      <h4 className="text-xs font-extrabold uppercase text-[#222121] tracking-wider border-b pb-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#E2004F] animate-pulse" />Configure Lead Telemetry</h4>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Form Category</label>
                          <select value={simFormType} onChange={(e) => setSimFormType(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 font-medium">
                            <option value="RAD">Request a Demo (RAD)</option>
                            <option value="WAD">Watch a Demo (WAD)</option>
                            <option value="Pricing">Pricing Page</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email / Domain</label>
                          <input type="text" value={simEmail} onChange={(e) => setSimEmail(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2 font-mono" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ZoomInfo Status</label>
                          <select value={simZoominfo} onChange={(e) => setSimZoominfo(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2">
                            <option value="success">Successfully Enriched</option>
                            <option value="failed">Failed / No Data</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Employee Count</label>
                          <input type="number" value={simEmployees} onChange={(e) => setSimEmployees(Number(e.target.value))} className="w-full bg-white border rounded-lg p-2 font-mono" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Customer / Exclusion</label>
                          <select value={simIsExclusion} onChange={(e) => setSimIsExclusion(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2">
                            <option value="no">Not Excluded</option>
                            <option value="yes">Exclusion Flag Matches</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CRM Preexisting Owner</label>
                          <select value={simSfdcOwner} onChange={(e) => setSimSfdcOwner(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2">
                            <option value="no_owner">No existing Owner</option>
                            <option value="has_owner">Active Owner Found</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs border-t pt-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">User Books Calendar?</label>
                          <select value={simBooksMeeting} onChange={(e) => setSimBooksMeeting(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2">
                            <option value="yes">Yes (Booked Slot)</option>
                            <option value="no">No (Abandoned)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">RingLead Match</label>
                          <select value={simRingLead} onChange={(e) => setSimRingLead(e.target.value)} className="w-full bg-slate-50 border rounded-lg p-2">
                            <option value="pass">Passes duplication</option>
                            <option value="fail">Fails (Duplicate Flagged)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Simulator Calculated Results & Trace Systems (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 shadow-inner">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400">Logic Calculation</span>
                            <h3 className="text-sm font-extrabold text-slate-800 mt-1"><FormattedText text={calculatedSimulationResult.scenario} /></h3>
                          </div>
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border shrink-0 ${calculatedSimulationResult.badgeColor}`}>{calculatedSimulationResult.type}</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-3 leading-relaxed"><FormattedText text={calculatedSimulationResult.desc} /></p>

                        <div className="mt-4 border-t pt-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Calculated Path trace</h4>
                          <div className="relative border-l-2 border-slate-200 ml-1 space-y-3.5">
                            {calculatedSimulationResult.flow.map((step, idx) => (
                              <div key={idx} className="relative pl-5">
                                <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#E2004F] ring-4 ring-white" />
                                <div className="text-xs font-semibold text-slate-700"><FormattedText text={step} /></div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Checkbox board showing active platforms */}
                      <div className="bg-white border border-[#EBE5D9] rounded-2xl p-4">
                        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-3">Ecosystem systems Engaged Checklist:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-bold">
                          {[
                            { key: 'website', name: 'Website Form', icon: <BobIcon /> },
                            { key: 'zoominfo', name: 'ZoomInfo API', icon: <ZoomInfoIcon /> },
                            { key: 'second_form', name: 'Fallback Form', icon: <BobIcon /> },
                            { key: 'concierge', name: 'CP Concierge', icon: <ChiliPiperIcon /> },
                            { key: 'marketo', name: 'Marketo Engine', icon: <MarketoIcon /> },
                            { key: 'salesforce', name: 'Salesforce CRM', icon: <SalesforceIcon /> },
                            { key: 'ringlead', name: 'RingLead Dedupe', icon: <RingLeadIcon /> },
                            { key: 'distro', name: 'CP Distro', icon: <ChiliPiperIcon /> }
                          ].map((sys) => {
                            const engaged = calculatedSimulationResult.systems.includes(sys.key);
                            return (
                              <div key={sys.key} className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 ${engaged ? 'bg-[#FFF0F3] border-[#E2004F] text-[#E2004F]' : 'bg-slate-50 text-slate-300 opacity-40'}`}>
                                <span className="flex items-center gap-1">{sys.icon}{sys.name}</span>
                                <span className="text-[8px] uppercase tracking-wider">{engaged ? '● ENGAGED' : '○ BYPASSED'}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TECHNICAL PLAYBOOK & MATRIX COMPARISON */}
            {activeTab === 'playbook' && (
              <div className="space-y-6 animate-fadeIn text-left">
                
                {window.ScenarioCardsGrid ? (
                  React.createElement(window.ScenarioCardsGrid, {
                    scenarios: SCENARIOS,
                    onCatchAll: () => goToCatchAllDashboard(7),
                  })
                ) : (
                  <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 text-sm text-slate-500">Loading scenario cards…</div>
                )}

                {/* Pillar Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-5 shadow-xs">
                    <span className="text-[#E2004F]"><ChiliPiperIcon /></span>
                    <h4 className="text-sm font-extrabold text-[#222121] mt-2">1. Pre-Routing Gates</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Chili Piper evaluates spam checkers, QA allowlists, domain ownership, and customer exclusion lists prior to presenting calendar options.</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-5 shadow-xs">
                    <span className="text-[#9F520B]"><ChiliPiperIcon /></span>
                    <h4 className="text-sm font-extrabold text-[#222121] mt-2">2. Telemetry Hierarchy</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Order of priority: Pre-existing Salesforce account attributes take top priority, followed by ZoomInfo, with manual entry fallback as P3.</p>
                  </div>
                  <div className="bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-5 shadow-xs">
                    <span className="text-teal-700"><ChiliPiperIcon /></span>
                    <h4 className="text-sm font-extrabold text-[#222121] mt-2">3. Modular Breakdown</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">Lead lifecycle split: Chili Piper Concierge manages live scheduling, Distro handles silent backend shuffles, and Handoff drives SDR-to-AE Pod handovers.</p>
                  </div>
                </div>

                {/* Comparative Matrix Table */}
                <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 shadow-xs">
                  <h3 className="text-sm font-extrabold text-[#222121] uppercase tracking-wider mb-4 border-b pb-2">Comparative Breakdown: Core Routing Modules</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#222121] border-collapse">
                      <thead>
                        <tr className="border-b border-[#EBE5D9] text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">
                          <th className="py-2.5 px-3">Dimension</th>
                          <th className="py-2.5 px-3">Chili Piper Concierge</th>
                          <th className="py-2.5 px-3">Chili Piper Distro</th>
                          <th className="py-2.5 px-3">Chili Piper Handoff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-3 font-extrabold">Primary Objective</td>
                          <td className="py-3 px-3">Instantly book initial discovery call on-page</td>
                          <td className="py-3 px-3">Assign cold/abandoned accounts behind scenes</td>
                          <td className="py-3 px-3">SDR to AE transition scheduling</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold">Trigger System</td>
                          <td className="py-3 px-3">Website submission API post-enrichment</td>
                          <td className="py-3 px-3">Salesforce trigger automation post-RingLead</td>
                          <td className="py-3 px-3">Manual extension action from within CRM</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold">Interactive Calendar</td>
                          <td className="py-3 px-3 text-[#E2004F] font-semibold">Yes (Visible to prospect)</td>
                          <td className="py-3 px-3 text-slate-400">No (Executed silently)</td>
                          <td className="py-3 px-3 text-emerald-600 font-semibold">Yes (Internal reps only)</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold">Segment Routing Rules</td>
                          <td className="py-3 px-3">Region, State, employee count (20-8000)</td>
                          <td className="py-3.5 px-3">HQ Region, Size limits, US States</td>
                          <td className="py-3.5 px-3">Configured team Pod groupings</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold">Round-Robin Model</td>
                          <td className="py-3 px-3">Flexible Round-Robin (Time-slot based)</td>
                          <td className="py-3 px-3">Strict Round-Robin (Quota balanced)</td>
                          <td className="py-3 px-3">Manual Selection (Suggested target list)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Warnings and Vulnerabilities */}
                <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-extrabold text-[#222121] uppercase tracking-wider border-b pb-2">System Vulnerabilities &amp; Guardrails</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border">
                      <span className="font-extrabold text-[#E2004F] block">⚠️ Ingestion Filter Gaps</span>
                      <p className="mt-1 leading-relaxed text-[11px]">If spam checkers, blacklisted country values, or blocklists inside Marketo mismatch Chili Piper parameters, a lead might book a slot but fail lead creation, creating ghost calendar slots.</p>
                    </div>
                    <div className="bg-[#FAF8F5] p-3 rounded-xl border">
                      <span className="font-extrabold text-[#E2004F] block">⚠️ Stale CRM Overrides</span>
                      <p className="mt-1 leading-relaxed text-[11px]">Because Salesforce values supersede fresh enrichment data, old accounts containing out-of-date region or size metrics will route on old parameters, skipping current telemetry.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: CATCH-ALL OPERATIONS DASHBOARD */}
            {activeTab === 'teams' && window.TeamsCountriesPanel && (
              React.createElement(window.TeamsCountriesPanel)
            )}

            {activeTab === 'operations' && window.OperationsPanel && (
              React.createElement(window.OperationsPanel, {
                initialDays: opsDays,
                onOpenScenario: () => {
                  setSelectedScenarioId('F');
                  navigateToTab('playbook');
                },
              })
            )}

            {/* TAB 5: SCHEMA REFERENCE TABLE */}
            {activeTab === 'fields' && (
              <div className="bg-white border border-[#EBE5D9] rounded-3xl p-6 shadow-sm animate-fadeIn text-left">
                <div className="mb-4">
                  <h3 className="text-sm font-extrabold text-[#222121] uppercase tracking-wide">Technical Schema Mappings</h3>
                  <p className="text-xs text-slate-500 mt-1">Complete API dictionary of enrichment variables and backend CRM fields compiled within the routing architecture.</p>
                </div>

                <div className="overflow-x-auto border rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">
                        <th className="py-3 px-4">Field API Name</th>
                        <th className="py-3 px-4">Origin Channel</th>
                        <th className="py-3 px-4">Target Destination</th>
                        <th className="py-3 px-4">System Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {FIELDS_REFERENCE.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono text-[#E2004F] font-semibold">{row.field}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{row.source}</td>
                          <td className="py-3 px-4 text-slate-500 font-medium">{row.dest}</td>
                          <td className="py-3 px-4 text-slate-600 text-[11px]"><FormattedText text={row.purpose} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>

          <footer className="border-t border-[#F0EAE1] bg-white mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
              <p>© 2026 HiBob RevOps Portal. Technical routing specifications strictly matched from source configuration records.</p>
              <p className="mt-2 text-[10px]">Catch-All metrics sync daily — see Catch-All Dashboard tab.</p>
            </div>
          </footer>
        </div>
      );
    }

    window.App = App;
