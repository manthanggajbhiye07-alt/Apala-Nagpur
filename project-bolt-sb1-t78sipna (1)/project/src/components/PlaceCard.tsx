import { MapPin, Bookmark, GitCompare, ArrowRight, ShieldCheck, IndianRupee, Clock } from 'lucide-react';
import type { Place } from '@/types';
import { CATEGORY_META } from '@/types';
import { SmartImage } from '@/components/SmartImage';
import { Badge } from '@/components/Badge';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  onSave?: () => void;
  onCompare?: () => void;
  saved?: boolean;
  comparing?: boolean;
}

export function PlaceCard({ place, onClick, onSave, onCompare, saved, comparing }: PlaceCardProps) {
  const meta = CATEGORY_META[place.category];

  return (
    <article
      className="group bg-white rounded-2xl border border-sand-200 shadow-card hover:shadow-card-lg transition-all duration-300 overflow-hidden cursor-pointer animate-slide-up"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <SmartImage
          src={place.images[0]}
          alt={place.name}
          className="w-full h-full"
          lazy
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        {place.verified && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/90 text-green-700 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-ink-900 text-base leading-snug mb-1 group-hover:text-teal-700 transition-colors">
          {place.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-ink-400 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{place.area}, Nagpur</span>
        </div>

        <p className="text-sm text-ink-600 line-clamp-2 mb-3 leading-relaxed">
          {place.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {place.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-sand-100 text-sand-700 font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-sand-100">
          <div className="flex items-center gap-3 text-xs text-ink-500">
            {place.priceLevel && (
              <span className="flex items-center gap-0.5">
                <IndianRupee className="w-3 h-3" />
                {'₹'.repeat(place.priceLevel)}
              </span>
            )}
            {place.entryFee && (
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <Badge variant="neutral" className="!py-0.5 !px-1.5 !text-[10px]">{place.entryFee}</Badge>
              </span>
            )}
            {place.hours && (
              <span className="flex items-center gap-0.5 truncate max-w-[100px]" title={place.hours}>
                <Clock className="w-3 h-3" />
                <span className="truncate">{place.hours.split(',')[0]}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onSave?.(); }}
              className={`p-1.5 rounded-lg transition-colors ${saved ? 'text-teal-600 bg-teal-50' : 'text-ink-400 hover:text-teal-600 hover:bg-teal-50'}`}
              title={saved ? 'Saved' : 'Save place'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            {onCompare && (
              <button
                onClick={(e) => { e.stopPropagation(); onCompare?.(); }}
                className={`p-1.5 rounded-lg transition-colors ${comparing ? 'text-lime-600 bg-lime-50' : 'text-ink-400 hover:text-lime-600 hover:bg-lime-50'}`}
                title="Add to compare"
              >
                <GitCompare className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
              className="p-1.5 rounded-lg text-ink-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
              title="View details"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
