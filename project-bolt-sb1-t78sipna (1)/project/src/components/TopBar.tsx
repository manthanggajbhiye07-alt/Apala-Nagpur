import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Menu, MapPin, X, Clock } from 'lucide-react';
import { CATEGORY_META } from '@/types';
import { PLACES } from '@/data';

interface TopBarProps {
  onMenuClick: () => void;
  onSelectPlace: (id: string) => void;
  onNavigate: (view: 'explore') => void;
}

export function TopBar({ onMenuClick, onSelectPlace, onNavigate }: TopBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PLACES.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSelect = (id: string) => {
    onSelectPlace(id);
    setQuery('');
    setShowResults(false);
    onNavigate('explore');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && focusedIdx >= 0 && results[focusedIdx]) {
      handleSelect(results[focusedIdx].id);
    } else if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-sand-200 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-sand-100 text-ink-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* City indicator */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-100 border border-sand-200">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-sm font-semibold text-ink-800">Nagpur</span>
          <span className="text-xs text-ink-400">Maharashtra, IN</span>
        </div>
      </div>

      {/* Search */}
      <div ref={containerRef} className="relative flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); setFocusedIdx(-1); }}
            onFocus={() => setShowResults(true)}
            onKeyDown={handleKey}
            placeholder="Search places, categories, areas..."
            className="w-full pl-10 pr-9 py-2.5 rounded-lg bg-sand-50 border border-sand-200 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setShowResults(false); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {showResults && query.trim() && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-card-xl border border-sand-200 overflow-hidden animate-scale-in z-30">
            {results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-ink-400">No places found for "{query}"</p>
                <p className="text-xs text-ink-300 mt-1">Try searching by name, area, or category</p>
              </div>
            ) : (
              <ul className="py-1.5">
                {results.map((place, idx) => {
                  const meta = CATEGORY_META[place.category];
                  return (
                    <li key={place.id}>
                      <button
                        onClick={() => handleSelect(place.id)}
                        onMouseEnter={() => setFocusedIdx(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          focusedIdx === idx ? 'bg-sand-50' : 'hover:bg-sand-50'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                          <MapPin className="w-4 h-4" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-800 truncate">{place.name}</p>
                          <p className="text-xs text-ink-400 truncate">{meta.label} · {place.area}</p>
                        </div>
                        <span className="text-[10px] text-ink-300 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {place.lastUpdated}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Right spacer */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-medium text-teal-700">Apala Nagpur</span>
        </div>
      </div>
    </header>
  );
}
