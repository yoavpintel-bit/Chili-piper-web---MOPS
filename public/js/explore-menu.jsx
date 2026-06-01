/* global React */
const { useEffect } = React;

const EXPLORE_LINKS = [
  { id: 'home', icon: '🏠', label: 'Home overview', technical: 'Home', desc: 'Short summary and how this portal is organized.' },
  { id: 'process', icon: '📖', label: 'Follow the lead journey', technical: 'Interactive Story', desc: 'See each step from form submit to rep assignment.' },
  { id: 'blueprint', icon: '🗺️', label: 'See how routing works', technical: 'Visual Blueprint', desc: 'Map of the full path — switch to technical view inside.' },
  { id: 'simulator', icon: '🧪', label: 'Try it yourself', technical: 'Scenario Playground', desc: 'Answer questions and watch what happens to a sample lead.' },
  { id: 'playbook', icon: '📋', label: 'What can happen to a lead', technical: 'Technical Playbook', desc: 'Nine outcomes (A–I), tools compared, and routing rules.' },
  { id: 'teams', icon: '🌍', label: 'Who covers which region', technical: 'Teams & Countries', desc: 'Sales teams and countries by inbound segment.' },
  { id: 'operations', icon: '📊', label: 'Leads we could not auto-assign', technical: 'Catch-All Dashboard', desc: 'Monitor and review leads that did not match a rule.', extra: { days: 7 } },
  { id: 'fields', icon: '⚙️', label: 'Technical stuff', technical: 'Field Mappings & modules', desc: 'Data fields, Concierge vs Distro vs Handoff, and API names.' },
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

function ExploreMenu({ open, onClose, onNavigate, activeTab }) {
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
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-label="Explore topics">
      <button type="button" className="absolute inset-0 bg-[#222121]/40 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBE5D9] bg-[#FAF8F5]">
          <div>
            <h2 className="text-lg font-extrabold text-[#222121]">Explore topics</h2>
            <p className="text-xs text-slate-500 mt-0.5">All sections live here</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white border border-transparent hover:border-[#EBE5D9]" aria-label="Close">
            <MenuIcon open />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
          {EXPLORE_LINKS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => { onNavigate(item.id, item.extra); onClose(); }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                    isActive
                      ? 'border-[#E2004F] bg-[#FFF0F3] ring-1 ring-[#E2004F]/20'
                      : 'border-[#EBE5D9] hover:border-[#E2004F] hover:bg-[#FFF0F3]/40'
                  }`}
                >
                  <div className="flex gap-3">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-extrabold ${isActive ? 'text-[#E2004F]' : 'text-[#222121] group-hover:text-[#E2004F]'}`}>
                        {item.label}
                        {isActive && <span className="ml-2 text-[10px] font-bold text-[#E2004F]">· current</span>}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.technical}</p>
                      <p className="text-xs text-slate-600 mt-1.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="p-4 border-t border-[#EBE5D9] bg-[#FAF8F5]">
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Open any topic above. Use <strong>technical details</strong> inside each section when you need field names or scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}

window.EXPLORE_LINKS = EXPLORE_LINKS;
window.MenuIcon = MenuIcon;
window.ExploreMenu = ExploreMenu;
