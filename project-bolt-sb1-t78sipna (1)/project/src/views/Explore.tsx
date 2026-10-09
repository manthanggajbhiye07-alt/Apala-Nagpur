import { useState, useMemo } from 'react';
import { Search, X, ChevronLeft, ChevronRight, MapPin, Filter, ShieldCheck, Inbox, Coffee } from 'lucide-react';
import type { Category, FoodType } from '@/types';
import { CATEGORY_META, FOOD_TYPE_LABELS } from '@/types';
import { PLACES } from '@/data';
import { MapView } from '@/components/MapView';
import { SmartImage } from '@/components/SmartImage';
import { FilterChips, type FilterChipOption } from '@/components/FilterChips';

interface ExploreProps {
  selectedId: string | null;
  onSelectPlace: (id: string) => void;
  onSave: (id: string) => void;
  onCompare: (id: string) => void;
  savedIds: Set<string>;
  comparingIds: Set<string>;
}

const CATEGORY_OPTIONS: FilterChipOption[] = Object.entries(CATEGORY_META).map(([key, meta]) => ({
  value: key,
  label: meta.label,
}));

const FOOD_TYPE_OPTIONS: FilterChipOption[] = (Object.entries(FOOD_TYPE_LABELS) as [FoodType, string][]).map(([key, label]) => ({
  value: key,
  label,
}));

export function Explore({ selectedId, onSelectPlace, onSave, onCompare, savedIds, comparingIds }: ExploreProps) {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [foodTypes, setFoodTypes] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(true);

  const showFoodFilters = useMemo(() => {
    if (categories.length === 0) return true;
    return categories.includes('food') || categories.includes('restaurant');
  }, [categories]);

  const filtered = useMemo(() => {
    return PLACES.filter(p => {
      if (categories.length > 0 && !categories.includes(p.category)) return false;
      if (foodTypes.length > 0) {
        if (!p.foodTypes || !foodTypes.some(ft => p.foodTypes!.includes(ft as FoodType))) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [categories, foodTypes, search]);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-ink-900">
      {/* Results panel */}
      <div className={`
        relative bg-sand-50 border-r border-sand-200 flex flex-col
        transition-all duration-300 ease-out flex-shrink-0
        ${panelOpen ? 'w-full sm:w-[380px]' : 'w-0'}
        overflow-hidden
      `}>
        {/* Panel header */}
        <div className="px-4 py-4 border-b border-sand-200 bg-white flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-ink-900 text-lg">Explore Nagpur</h2>
            <span className="text-xs text-ink-400 font-medium">{filtered.length} places</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name, area, tag..."
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-sand-50 border border-sand-200 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex items-start gap-2">
            <Filter className="w-4 h-4 text-ink-400 mt-1.5 flex-shrink-0" />
            <FilterChips options={CATEGORY_OPTIONS} selected={categories} onChange={setCategories} />
          </div>

          {/* Food type filters */}
          {showFoodFilters && (
            <div className="flex items-start gap-2">
              <Coffee className="w-4 h-4 text-orange-500 mt-1.5 flex-shrink-0" />
              <FilterChips options={FOOD_TYPE_OPTIONS} selected={foodTypes} onChange={setFoodTypes} />
            </div>
          )}
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="w-10 h-10 text-ink-300 mb-3" />
              <p className="text-sm font-medium text-ink-500">No places match your filters</p>
              <p className="text-xs text-ink-400 mt-1">Try clearing filters or adjusting search</p>
              <button
                onClick={() => { setSearch(''); setCategories([]); setFoodTypes([]); }}
                className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map(place => {
              const meta = CATEGORY_META[place.category as Category];
              const isSelected = place.id === selectedId;
              return (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place.id)}
                  className={`w-full flex gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 shadow-glow-teal'
                      : 'bg-white border-sand-200 hover:border-sand-300 hover:shadow-card'
                  }`}
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <SmartImage src={place.images[0]} alt={place.name} className="w-full h-full" lazy />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${meta.color}`}>{meta.label}</span>
                      {place.verified && <ShieldCheck className="w-3 h-3 text-green-600 flex-shrink-0" />}
                    </div>
                    <h3 className={`text-sm font-semibold truncate ${isSelected ? 'text-teal-700' : 'text-ink-800'}`}>
                      {place.name}
                    </h3>
                    <p className="text-xs text-ink-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">{place.area}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSave(place.id); }}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${savedIds.has(place.id) ? 'text-teal-600 bg-teal-100' : 'text-ink-400 hover:bg-sand-100'}`}
                      >
                        {savedIds.has(place.id) ? 'Saved' : 'Save'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onCompare(place.id); }}
                        className={`text-xs px-2 py-0.5 rounded transition-colors ${comparingIds.has(place.id) ? 'text-lime-600 bg-lime-100' : 'text-ink-400 hover:bg-sand-100'}`}
                      >
                        {comparingIds.has(place.id) ? 'Comparing' : 'Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="absolute top-1/2 -translate-y-1/2 z-[500] w-7 h-14 bg-white rounded-r-lg border border-l-0 border-sand-200 flex items-center justify-center shadow-card hover:bg-sand-50 transition-all"
        style={{ left: panelOpen ? '380px' : '0px' }}
      >
        {panelOpen ? <ChevronLeft className="w-4 h-4 text-ink-500" /> : <ChevronRight className="w-4 h-4 text-ink-500" />}
      </button>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          places={filtered}
          selectedId={selectedId}
          onSelectPlace={onSelectPlace}
          className="w-full h-full"
        />
        {/* Map overlay info */}
        <div className="absolute bottom-4 left-4 bg-ink-900/80 backdrop-blur-sm rounded-lg px-3 py-2 z-[400] border border-ink-700/50">
          <p className="text-xs text-ink-300 font-medium">© OpenStreetMap contributors</p>
          <p className="text-[10px] text-ink-500">{filtered.length} places shown · Click markers for details</p>
        </div>
      </div>
    </div>
  );
}
