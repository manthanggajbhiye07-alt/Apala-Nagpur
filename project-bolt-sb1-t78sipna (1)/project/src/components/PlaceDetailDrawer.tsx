import { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Clock, IndianRupee, ShieldCheck, ExternalLink, Bookmark, GitCompare, Navigation, ChevronLeft, ChevronRight, Info, Calendar, Tag, Map as MapIcon } from 'lucide-react';
import type { Place } from '@/types';
import { CATEGORY_META } from '@/types';
import { getNearbyPlaces } from '@/data';
import { SmartImage } from '@/components/SmartImage';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { MapView } from '@/components/MapView';

interface PlaceDetailDrawerProps {
  place: Place | null;
  onClose: () => void;
  onSave?: (id: string) => void;
  onCompare?: (id: string) => void;
  onSelectPlace?: (id: string) => void;
  saved?: boolean;
  comparing?: boolean;
}

export function PlaceDetailDrawer({ place, onClose, onSave, onCompare, onSelectPlace, saved, comparing }: PlaceDetailDrawerProps) {
  const [imageIdx, setImageIdx] = useState(0);

  useEffect(() => {
    setImageIdx(0);
  }, [place?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (place) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [place, onClose]);

  const handleSave = useCallback(() => { if (place) onSave?.(place.id); }, [place, onSave]);
  const handleCompare = useCallback(() => { if (place) onCompare?.(place.id); }, [place, onCompare]);
  const handleNearby = useCallback((id: string) => { onSelectPlace?.(id); }, [onSelectPlace]);

  if (!place) return null;
  const meta = CATEGORY_META[place.category];
  const nearby = getNearbyPlaces(place);

  return (
    <>
      <div
        className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-sand-50 z-50 shadow-card-xl overflow-y-auto scrollbar-thin animate-slide-right">
        {/* Image gallery */}
        <div className="relative aspect-[16/10] bg-sand-200 flex-shrink-0">
          <SmartImage
            src={place.images[imageIdx]}
            alt={place.name}
            className="w-full h-full"
            lazy={false}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-ink-800 shadow-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {place.images.length > 1 && (
            <>
              <button
                onClick={() => setImageIdx(i => (i - 1 + place.images.length) % place.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-ink-800 shadow-sm transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setImageIdx(i => (i + 1) % place.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-ink-800 shadow-sm transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {place.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imageIdx ? 'bg-white w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}>
              {meta.label}
            </span>
            {place.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-green-700">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title + location */}
          <div>
            <h2 className="font-display font-bold text-2xl text-ink-900 mb-2">{place.name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{place.address}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="primary" size="md" icon={<Navigation className="w-4 h-4" />} onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`, '_blank')}>
              Directions
            </Button>
            <Button
              variant={saved ? 'secondary' : 'outline'}
              size="md"
              icon={<Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />}
              onClick={handleSave}
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
            {onCompare && (
              <Button
                variant={comparing ? 'secondary' : 'outline'}
                size="md"
                icon={<GitCompare className="w-4 h-4" />}
                onClick={handleCompare}
              >
                {comparing ? 'Comparing' : 'Compare'}
              </Button>
            )}
          </div>

          {/* Description */}
          <section>
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm text-ink-700 leading-relaxed">{place.description}</p>
          </section>

          {/* Historical context */}
          {place.historicalContext && (
            <section className="bg-sand-100 rounded-xl p-4 border border-sand-200">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-ink-800">Historical & Cultural Context</h3>
              </div>
              <p className="text-sm text-ink-600 leading-relaxed">{place.historicalContext}</p>
              {place.established && (
                <p className="text-xs text-ink-400 mt-2">Established: {place.established}</p>
              )}
            </section>
          )}

          {/* Mini map */}
          <section>
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Location</h3>
            <div className="h-48 rounded-xl overflow-hidden border border-sand-200">
              <MapView
                places={[place]}
                selectedId={place.id}
                className="w-full h-full"
                flyTo={{ lat: place.lat, lng: place.lng, zoom: 14 }}
              />
            </div>
          </section>

          {/* Details grid */}
          <section className="grid grid-cols-2 gap-4">
            {place.hours && (
              <div className="bg-white rounded-xl p-3 border border-sand-200">
                <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  Hours
                </div>
                <p className="text-sm text-ink-800 font-medium">{place.hours}</p>
              </div>
            )}
            {place.entryFee && (
              <div className="bg-white rounded-xl p-3 border border-sand-200">
                <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                  <IndianRupee className="w-3.5 h-3.5" />
                  Entry
                </div>
                <p className="text-sm text-ink-800 font-medium">{place.entryFee}</p>
              </div>
            )}
            {place.priceLevel && (
              <div className="bg-white rounded-xl p-3 border border-sand-200">
                <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  Price
                </div>
                <p className="text-sm text-ink-800 font-medium">{'₹'.repeat(place.priceLevel)}{'·'.repeat(3 - place.priceLevel)}</p>
              </div>
            )}
            <div className="bg-white rounded-xl p-3 border border-sand-200">
              <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Updated
              </div>
              <p className="text-sm text-ink-800 font-medium">{place.lastUpdated}</p>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {place.tags.map(tag => (
                <Badge key={tag} variant="neutral">{tag}</Badge>
              ))}
            </div>
          </section>

          {/* Source & evidence */}
          <section className="border-t border-sand-200 pt-4">
            <div className="flex items-center justify-between text-xs text-ink-400">
              <div className="flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5" />
                <span>Source: {place.source}</span>
              </div>
              {place.sourceUrl && (
                <a
                  href={place.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium"
                >
                  View source
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            {place.imageAttribution && (
              <p className="text-[11px] text-ink-300 mt-2">Photo: {place.imageAttribution}</p>
            )}
          </section>

          {/* Nearby */}
          {nearby.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Nearby Destinations</h3>
              <div className="grid grid-cols-2 gap-3">
                {nearby.map(np => {
                  const nmeta = CATEGORY_META[np.category];
                  return (
                    <button
                      key={np.id}
                      onClick={() => handleNearby(np.id)}
                      className="group text-left bg-white rounded-xl border border-sand-200 overflow-hidden hover:shadow-card transition-all"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <SmartImage src={np.images[0]} alt={np.name} className="w-full h-full" lazy />
                      </div>
                      <div className="p-2.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${nmeta.color}`}>{nmeta.label}</span>
                        <p className="text-sm font-semibold text-ink-800 mt-1 truncate group-hover:text-teal-700">{np.name}</p>
                        <p className="text-xs text-ink-400 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {np.area}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

