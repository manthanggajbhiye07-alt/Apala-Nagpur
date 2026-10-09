import { useMemo } from 'react';
import { GitCompare, X, Check, Minus, ShieldCheck, MapPin, Clock, IndianRupee, Tag, Calendar, BarChart3, Info } from 'lucide-react';
import type { Place } from '@/types';
import { CATEGORY_META } from '@/types';
import { PLACES, getPlaceById } from '@/data';
import { SmartImage } from '@/components/SmartImage';
import { Badge } from '@/components/Badge';

interface CompareProps {
  comparingIds: Set<string>;
  onRemovePlace: (id: string) => void;
  onAddPlace: (id: string) => void;
  onSelectPlace: (id: string) => void;
}

export function Compare({ comparingIds, onRemovePlace, onAddPlace, onSelectPlace }: CompareProps) {
  const comparing = useMemo(() =>
    Array.from(comparingIds).map(getPlaceById).filter(Boolean) as Place[],
    [comparingIds]
  );

  const availableToAdd = useMemo(() =>
    PLACES.filter(p => !comparingIds.has(p.id)),
    [comparingIds]
  );

  // Category distribution chart data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    PLACES.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([cat, count]) => ({
      category: cat,
      label: CATEGORY_META[cat as keyof typeof CATEGORY_META].label,
      count,
      color: CATEGORY_META[cat as keyof typeof CATEGORY_META].pinColor,
    })).sort((a, b) => b.count - a.count);
  }, []);

  const maxCount = Math.max(...categoryData.map(d => d.count));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink-900 mb-1">Compare & Insights</h1>
        <p className="text-sm text-ink-500">
          Compare places side-by-side and see distribution insights across Nagpur's indexed destinations.
        </p>
      </div>

      {/* Insights chart */}
      <section className="bg-white rounded-2xl border border-sand-200 p-6 shadow-card">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          <h2 className="font-display font-semibold text-ink-900 text-lg">Category Distribution</h2>
        </div>
        <p className="text-xs text-ink-400 mb-5">Based on {PLACES.length} indexed places · Source: OpenStreetMap, NMC, ASI</p>

        <div className="space-y-3">
          {categoryData.map(d => (
            <div key={d.category} className="flex items-center gap-3">
              <div className="w-28 text-sm font-medium text-ink-700 flex-shrink-0 text-right">{d.label}</div>
              <div className="flex-1 h-7 bg-sand-50 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg flex items-center px-2 transition-all duration-500 animate-slide-right"
                  style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: d.color }}
                >
                  <span className="text-xs font-bold text-white">{d.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-sand-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-ink-400">Total Places</p>
            <p className="font-display font-bold text-xl text-ink-900">{PLACES.length}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Verified</p>
            <p className="font-display font-bold text-xl text-green-600">{PLACES.filter(p => p.verified).length}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Categories</p>
            <p className="font-display font-bold text-xl text-ink-900">{categoryData.length}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400">Areas Covered</p>
            <p className="font-display font-bold text-xl text-ink-900">{new Set(PLACES.map(p => p.area)).size}</p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white rounded-2xl border border-sand-200 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-sand-200 flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-teal-600" />
          <h2 className="font-display font-semibold text-ink-900 text-lg">Side-by-Side Comparison</h2>
          {comparing.length > 0 && (
            <span className="text-xs text-ink-400 ml-auto">{comparing.length} selected</span>
          )}
        </div>

        {comparing.length === 0 ? (
          <div className="px-6 py-12">
            <div className="flex flex-col items-center text-center mb-6">
              <GitCompare className="w-12 h-12 text-ink-200 mb-3" />
              <p className="text-sm font-medium text-ink-500">No places selected for comparison</p>
              <p className="text-xs text-ink-400 mt-1">Add places below to compare them side-by-side</p>
            </div>

            {/* Quick add from all places */}
            <div className="border-t border-sand-100 pt-6">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Add places to compare</p>
              <div className="flex flex-wrap gap-2">
                {availableToAdd.slice(0, 10).map(place => {
                  const meta = CATEGORY_META[place.category];
                  return (
                    <button
                      key={place.id}
                      onClick={() => onAddPlace(place.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-sand-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all group"
                    >
                      <span className={`w-6 h-6 rounded ${meta.color} flex items-center justify-center`}>
                        <MapPin className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm font-medium text-ink-700 group-hover:text-teal-700">{place.name}</span>
                      <span className="text-xs text-teal-600">+</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider w-32 sticky left-0 bg-white z-10">
                    Attribute
                  </th>
                  {comparing.map(place => {
                    const meta = CATEGORY_META[place.category];
                    return (
                      <th key={place.id} className="text-left px-4 py-3 min-w-[200px]">
                        <div className="relative">
                          <button
                            onClick={() => onRemovePlace(place.id)}
                            className="absolute -top-1 -right-1 p-1 rounded-full bg-sand-100 hover:bg-red-50 text-ink-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="w-full h-24 rounded-lg overflow-hidden mb-2">
                            <SmartImage src={place.images[0]} alt={place.name} className="w-full h-full" lazy />
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${meta.color}`}>{meta.label}</span>
                          <p className="text-sm font-semibold text-ink-800 mt-1.5">{place.name}</p>
                          <p className="text-xs text-ink-400">{place.area}</p>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <CompareRow label="Verified" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      {p.verified ? (
                        <span className="inline-flex items-center gap-1 text-green-600"><Check className="w-4 h-4" /> Yes</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-ink-400"><Minus className="w-4 h-4" /> No</span>
                      )}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="Location" icon={<MapPin className="w-3.5 h-3.5" />}>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100 text-ink-700">{p.address}</td>
                  ))}
                </CompareRow>

                <CompareRow label="Hours" icon={<Clock className="w-3.5 h-3.5" />}>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      {p.hours ? <span className="text-ink-700">{p.hours}</span> : <span className="text-ink-300 italic">Not available</span>}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="Entry Fee" icon={<IndianRupee className="w-3.5 h-3.5" />}>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      {p.entryFee ? <Badge variant="neutral">{p.entryFee}</Badge> : <span className="text-ink-300 italic">Not listed</span>}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="Price Level" icon={<Tag className="w-3.5 h-3.5" />}>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      {p.priceLevel ? <span className="text-ink-700 font-medium">{'₹'.repeat(p.priceLevel)}{'·'.repeat(3 - p.priceLevel)}</span> : <span className="text-ink-300 italic">N/A</span>}
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="Last Updated" icon={<Calendar className="w-3.5 h-3.5" />}>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100 text-ink-700">{p.lastUpdated}</td>
                  ))}
                </CompareRow>

                <CompareRow label="Source">
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100 text-xs text-ink-600">{p.source}</td>
                  ))}
                </CompareRow>

                <CompareRow label="Tags">
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-sand-100 text-sand-700 font-medium">{tag}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </CompareRow>

                <CompareRow label="Description">
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      <p className="text-xs text-ink-600 leading-relaxed line-clamp-3">{p.description}</p>
                    </td>
                  ))}
                </CompareRow>

                <tr>
                  <td className="px-4 py-3 border-t border-sand-100 sticky left-0 bg-white">
                    <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Actions</span>
                  </td>
                  {comparing.map(p => (
                    <td key={p.id} className="px-4 py-3 border-t border-sand-100">
                      <button
                        onClick={() => onSelectPlace(p.id)}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                      >
                        View details →
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {comparing.length > 0 && comparing.length < 4 && (
          <div className="px-6 py-4 border-t border-sand-200 bg-sand-50/50">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Add more places</p>
            <div className="flex flex-wrap gap-2">
              {availableToAdd.slice(0, 6).map(place => (
                <button
                  key={place.id}
                  onClick={() => onAddPlace(place.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-sand-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-xs font-medium text-ink-600 hover:text-teal-700"
                >
                  {place.name}
                  <span className="text-teal-600">+</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Data note */}
      <div className="bg-sand-100 border border-sand-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-ink-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-ink-600 leading-relaxed">
          Comparison data reflects only sourced attributes. Missing attributes are shown as "Not available" rather than fabricated.
          Charts use the {PLACES.length} places currently indexed in Apala Nagpur — not a complete inventory of Nagpur.
        </p>
      </div>

      <footer className="text-center py-4">
        <p className="text-xs text-ink-400">Apala Nagpur · Comparison & Insights · Data current as of {new Date().toLocaleDateString('en-IN')}</p>
      </footer>
    </div>
  );
}

function CompareRow({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <tr>
      <td className="px-4 py-3 border-t border-sand-100 sticky left-0 bg-white">
        <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider flex items-center gap-1.5">
          {icon}
          {label}
        </span>
      </td>
      {children}
    </tr>
  );
}
