import { LayoutDashboard, Map, ShieldCheck, GitCompare, MapPin, X } from 'lucide-react';

export type View = 'dashboard' | 'explore' | 'safety' | 'compare';

interface SidebarProps {
  current: View;
  onNavigate: (view: View) => void;
  savedCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'explore', label: 'Explore Map', icon: Map },
  { id: 'safety', label: 'Safety & Evidence', icon: ShieldCheck },
  { id: 'compare', label: 'Compare', icon: GitCompare },
];

export function Sidebar({ current, onNavigate, savedCount, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-950/50 z-30 lg:hidden animate-fade-in" onClick={onMobileClose} />
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[260px] z-40
        bg-ink-900 text-ink-100 flex flex-col
        transition-transform duration-300 ease-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-ink-800/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-base leading-none">Apala</h1>
              <span className="text-[10px] text-teal-400 font-medium tracking-wider uppercase">Nagpur</span>
            </div>
          </div>
          <button onClick={onMobileClose} className="lg:hidden p-1 text-ink-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-dark">
          <p className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider px-3 mb-2">Navigation</p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); onMobileClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-teal-600/15 text-teal-400'
                    : 'text-ink-300 hover:bg-ink-800/60 hover:text-white'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-teal-400' : 'text-ink-400 group-hover:text-white'}`} />
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-ink-800/60 flex-shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-ink-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>{savedCount} saved</span>
            </div>
            <span className="text-ink-500">v1.0</span>
          </div>
          <p className="text-[10px] text-ink-600 mt-2 leading-relaxed">
            Data: OpenStreetMap, NMC, ASI & citizen reports.
            Photos: Wikimedia Commons & Pexels.
          </p>
        </div>
      </aside>
    </>
  );
}
