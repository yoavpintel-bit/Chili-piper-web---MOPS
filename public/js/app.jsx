    const { useState, useEffect, useRef } = React;

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

    const NAV_TABS = [
      { id: 'home', label: 'Home', accent: true },
      { id: 'process', label: 'Interactive Story', short: 'Story' },
      { id: 'blueprint', label: 'Visual Blueprint', short: 'Blueprint' },
      { id: 'simulator', label: 'Scenario Playground', short: 'Playground' },
      { id: 'playbook', label: 'Technical Playbook', short: 'Playbook' },
      { id: 'teams', label: 'Teams & Countries', short: 'Teams' },
      { id: 'operations', label: 'Catch-All Dashboard', short: 'Catch-All', accent: true },
      { id: 'fields', label: 'Field Mappings', short: 'Fields' },
    ];

    function App() {
      const VALID_TABS = ['home', 'process', 'blueprint', 'simulator', 'playbook', 'fields', 'teams', 'operations'];
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const tabParam = params.get('tab');
      const initialTab = VALID_TABS.includes(tabParam) ? tabParam : 'home';
      const initialOpsDays = Number(params.get('days')) || 7;

      const [activeTab, setActiveTab] = useState(initialTab);
      const [, panelLoadTick] = useState(0);

      useEffect(() => {
        const id = setInterval(() => {
          setPanelLoadTick((t) => t + 1);
          if (window.HomePanel && window.BlueprintPanel && window.TeamsCountriesPanel && window.OperationsPanel) {
            clearInterval(id);
          }
        }, 100);
        return () => clearInterval(id);
      }, []);
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

      const journeyTrackRef = useRef(null);
      const stepRefs = useRef({});

      const JOURNEY_STICKY_TOP_PX = 112;
      const JOURNEY_STEP_VH = 90;

      const getJourneyScrollMetrics = () => {
        const track = journeyTrackRef.current;
        if (!track) return null;
        const viewport = window.innerHeight - JOURNEY_STICKY_TOP_PX;
        const trackScrollable = Math.max(track.offsetHeight - viewport, 1);
        return { track, trackScrollable };
      };

      const scrollToStep = (id, behavior = 'smooth') => {
        const metrics = getJourneyScrollMetrics();
        if (!metrics) return;
        const idx = JOURNEY_STEPS.findIndex((s) => s.id === id);
        if (idx < 0) return;
        setActiveStepId(id);
        const progress = idx / JOURNEY_STEPS.length;
        window.scrollTo({
          top: metrics.track.offsetTop + progress * metrics.trackScrollable,
          behavior,
        });
      };

      const startJourney = () => scrollToStep('step1');

      // Page scroll through the journey track drives the active step
      useEffect(() => {
        if (activeTab !== 'process') return;

        let ticking = false;

        const updateActiveStep = () => {
          const metrics = getJourneyScrollMetrics();
          if (!metrics) {
            ticking = false;
            return;
          }
          const { track, trackScrollable } = metrics;
          const scrolled = Math.max(0, JOURNEY_STICKY_TOP_PX - track.getBoundingClientRect().top);
          const progress = Math.min(1, scrolled / trackScrollable);
          const idx = Math.min(
            JOURNEY_STEPS.length - 1,
            Math.floor(progress * JOURNEY_STEPS.length)
          );
          setActiveStepId(JOURNEY_STEPS[idx].id);
          ticking = false;
        };

        const handleScroll = () => {
          if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(updateActiveStep);
          }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        handleScroll();

        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', handleScroll);
        };
      }, [activeTab]);

      const toggleBR = (id) => {
        setExpandedBR(prev => ({ ...prev, [id]: !prev[id] }));
      };

      const toggleTS = (id) => {
        setExpandedTS(prev => ({ ...prev, [id]: !prev[id] }));
      };


      return (
        <div className="min-h-screen bg-[#FFFDF9] text-[#222121] font-sans antialiased selection:bg-[#FFF0F3] selection:text-[#E2004F]">

          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EBE5D9] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 py-3 border-b border-[#F0EAE1]/80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E2004F] to-[#ff4d7a] text-white flex items-center justify-center shadow-md shrink-0">
                    <BobIcon />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-extrabold text-[#222121] tracking-tight">HiBob</span>
                      <span className="text-[10px] bg-[#FFF0F3] text-[#E2004F] font-bold px-2 py-0.5 rounded-full border border-[#FFD2DB]">
                        RevOps
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      Chili piper in HiBob — all you need to know
                    </p>
                    {typeof window !== 'undefined' && window.__PORTAL_BUILD__ && (
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">build {window.__PORTAL_BUILD__}</p>
                    )}
                  </div>
                </div>
                <a
                  href="?tab=operations&days=7"
                  onClick={(e) => { e.preventDefault(); goToCatchAllDashboard(7); }}
                  className="hidden sm:inline-flex text-xs font-bold text-[#E2004F] bg-[#FFF0F3] border border-[#FFD2DB] px-3 py-2 rounded-xl hover:bg-white shrink-0"
                >
                  Catch-All ↗
                </a>
              </div>
              <nav className="flex gap-1 overflow-x-auto py-2.5 custom-scroll -mx-1 px-1" aria-label="Main">
                {NAV_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const isOps = tab.id === 'operations';
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      data-tab-operations={isOps || undefined}
                      onClick={() => (isOps ? goToCatchAllDashboard(7) : navigateToTab(tab.id))}
                      className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? tab.accent
                            ? 'bg-[#E2004F] text-white shadow-sm'
                            : 'bg-[#222121] text-white shadow-sm'
                          : 'text-[#5A5755] hover:bg-[#F5F1E9] hover:text-[#222121]'
                      }`}
                    >
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.short || tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </header>

          {/* Hero Banner Area (non-home, non-process tabs) */}
          {activeTab !== 'home' && activeTab !== 'process' && activeTab !== 'blueprint' && activeTab !== 'simulator' && activeTab !== 'playbook' && (
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
              <div className="animate-fadeIn -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="px-4 sm:px-6 lg:px-8 space-y-6">
                  {window.JourneyHero && React.createElement(window.JourneyHero, {
                    onStartJourney: startJourney,
                  })}
                </div>

                {/* Tall scroll track — page scroll advances steps; panel stays sticky */}
                <div
                  ref={journeyTrackRef}
                  className="relative"
                  style={{ height: `${JOURNEY_STEPS.length * JOURNEY_STEP_VH}vh` }}
                >
                  <div className="sticky top-28 z-20 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-[calc(100vh-7rem)] min-h-[480px] max-h-[calc(100vh-7rem)]">
                      {/* Left: live simulator */}
                      <div className="lg:col-span-5 flex flex-col min-h-0 gap-3">
                        <div className="bg-white border-4 border-[#222121] rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col flex-1 min-h-0 overflow-hidden">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
                            <div className="flex space-x-1.5">
                              <span className="w-3 h-3 rounded-full bg-rose-400" />
                              <span className="w-3 h-3 rounded-full bg-amber-400" />
                              <span className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase">HiBob Live Simulator</span>
                          </div>
                          <div className="flex-1 min-h-0 overflow-y-auto custom-scroll py-2">
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
                        </div>
                        <div className="hidden lg:block bg-[#FAF8F5] border border-[#EBE5D9] rounded-2xl p-4 text-sm shrink-0 text-left">
                          <div className="font-extrabold text-[#222121]">💡 Scroll to walk the journey</div>
                          <p className="text-slate-600 leading-relaxed mt-1 text-xs">
                            Keep scrolling — the simulator stays on screen while each step updates.
                            After step 7, scroll continues to quick-jump below.
                          </p>
                        </div>
                      </div>

                      {/* Right: one step at a time */}
                      <div className="lg:col-span-7 flex flex-col min-h-0">
                        <div className="flex items-center justify-between gap-2 mb-2 shrink-0 px-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Step {JOURNEY_STEPS.findIndex((s) => s.id === activeStepId) + 1} of {JOURNEY_STEPS.length}
                          </span>
                          <div className="flex gap-1">
                            {JOURNEY_STEPS.map((s) => (
                              <span
                                key={s.id}
                                className={`h-1.5 rounded-full transition-all ${
                                  s.id === activeStepId ? 'w-6 bg-[#E2004F]' : 'w-1.5 bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scroll pr-0 lg:pr-2 text-left">
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
                              singleStepOnly: true,
                            })
                          ) : (
                            <p className="text-slate-400 text-sm py-8">Loading journey steps…</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick-jump — only reachable after scrolling past the track */}
                <div className="px-4 sm:px-6 lg:px-8 mt-6 mb-2">
                  <div className="bg-white border border-[#EBE5D9] p-3 rounded-2xl flex flex-col sm:flex-row justify-between items-center text-xs font-bold gap-3">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider pl-1">Jump to a step:</span>
                    <div className="flex flex-wrap gap-1 justify-center flex-1">
                      {JOURNEY_STEPS.map((s) => (
                        <button
                          key={s.id}
                          type="button"
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

            {/* TAB 3: SCENARIO PLAYGROUND — step-by-step routing game */}
            {activeTab === 'simulator' && window.ScenarioGamePanel && (
              <div className="animate-fadeIn -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                {React.createElement(window.ScenarioGamePanel, { FormattedText })}
              </div>
            )}
            {activeTab === 'simulator' && !window.ScenarioGamePanel && (
              <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 text-sm text-slate-500">Loading scenario game…</div>
            )}

            {/* TAB 4: TECHNICAL PLAYBOOK & MATRIX COMPARISON */}
            {activeTab === 'playbook' && (
              <div className="space-y-6 animate-fadeIn text-left pb-4">
                <section className="bg-gradient-to-br from-[#222121] to-[#2d2b2b] text-white rounded-2xl p-5 border border-[#333]">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFB3C7]">Technical Playbook</span>
                  <h2 className="text-xl font-extrabold mt-1">Scenarios A–I &amp; module reference</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Routing paths, comparison matrix, and guardrails — scroll for full detail on each scenario card.
                  </p>
                </section>
                
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
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">Lead lifecycle split: Chili Piper Concierge manages live scheduling, Distro handles silent backend shuffles, and Handoff drives XDR-to-AE Pod handovers.</p>
                  </div>
                </div>

                {/* Comparative Matrix Table */}
                <div className="bg-white border border-[#EBE5D9] rounded-2xl p-5 shadow-xs">
                  <h3 className="text-sm font-extrabold text-[#222121] uppercase tracking-wider mb-4 border-b pb-2">Comparative Breakdown: Core Routing Modules</h3>
                  <div className="overflow-x-auto -mx-1 px-1">
                    <table className="w-full min-w-[640px] text-left text-xs text-[#222121] border-collapse table-fixed">
                      <thead>
                        <tr className="border-b border-[#EBE5D9] text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">
                          <th className="py-2.5 px-3 w-[18%] align-bottom">Dimension</th>
                          <th className="py-2.5 px-3 w-[27%] align-bottom">Chili Piper Concierge</th>
                          <th className="py-2.5 px-3 w-[27%] align-bottom">Chili Piper Distro</th>
                          <th className="py-2.5 px-3 w-[28%] align-bottom">Chili Piper Handoff</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-3 px-3 font-extrabold align-top break-words">Primary Objective</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Instantly book initial discovery call on-page</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Assign cold/abandoned accounts behind scenes</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">XDR to AE transition scheduling</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold align-top break-words">Trigger System</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Website submission API post-enrichment</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Salesforce trigger automation post-RingLead</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Manual extension action from within CRM</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold align-top break-words">Interactive Calendar</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed text-[#E2004F] font-semibold">Yes (Visible to prospect)</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed text-slate-500">No (Executed silently)</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed text-emerald-600 font-semibold">Yes (Internal reps only)</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold align-top break-words">Segment Routing Rules</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Region, State, employee count (20-8000)</td>
                          <td className="py-3.5 px-3 align-top break-words leading-relaxed">HQ Region, Size limits, US States</td>
                          <td className="py-3.5 px-3 align-top break-words leading-relaxed">Configured team Pod groupings</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-3 font-extrabold align-top break-words">Round-Robin Model</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Flexible Round-Robin (Time-slot based)</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Strict Round-Robin (Quota balanced)</td>
                          <td className="py-3 px-3 align-top break-words leading-relaxed">Manual Selection (Suggested target list)</td>
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
