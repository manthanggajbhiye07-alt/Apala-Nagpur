import { useMemo, useState, useEffect } from 'react';
import { MapPin, ShieldCheck, Cloud, Wind, Droplets, ChevronRight, Camera, Trees, UtensilsCrossed, Landmark, Clock, AlertCircle } from 'lucide-react';
import { CATEGORY_META } from '@/types';
import { PLACES, SAFETY_REPORTS, WEATHER_FALLBACK, fetchWeather } from '@/data';
import type { WeatherData } from '@/types';
import { PlaceCard } from '@/components/PlaceCard';
import { SmartImage } from '@/components/SmartImage';
import { StatusBadge } from '@/components/Badge';
import { MapView } from '@/components/MapView';
import type { View } from '@/components/Sidebar';

interface DashboardProps {
  onSelectPlace: (id: string) => void;
  onNavigate: (view: View) => void;
  onSave: (id: string) => void;
  onCompare: (id: string) => void;
  savedIds: Set<string>;
  comparingIds: Set<string>;
}

export function Dashboard({ onSelectPlace, onNavigate, onSave, onCompare, savedIds, comparingIds }: DashboardProps) {
  const featured = useMemo(() => PLACES.filter(p => p.verified && p.images.length >= 2).slice(0, 4), []);
  const heritageFood = useMemo(() => PLACES.filter(p => p.category === 'heritage' || p.category === 'food' || p.category === 'landmark' || p.category === 'restaurant').slice(0, 6), []);
  const recentReports = useMemo(() => SAFETY_REPORTS.slice().sort((a, b) => b.reportedAt.localeCompare(a.reportedAt)).slice(0, 4), []);
  const [weather, setWeather] = useState<WeatherData>(WEATHER_FALLBACK);

  useEffect(() => {
    fetchWeather().then(setWeather);
  }, []);

  const verifiedCount = PLACES.filter(p => p.verified).length;
  const pendingCount = SAFETY_REPORTS.filter(r => r.status === 'pending').length;

  const categoryIcons: Record<string, typeof Camera> = {
    heritage: Landmark,
    landmark: Landmark,
    food: UtensilsCrossed,
    restaurant: UtensilsCrossed,
    park: Trees,
    attraction: Camera,
    cultural: Camera,
    accommodation: Camera,
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden bg-ink-900">
        <div className="absolute inset-0">
          <SmartImage
            src="https://commons.wikimedia.org/wiki/Special:FilePath/Ambazari_lake_nagpur.jpg?width=940"
            alt="Ambazari Lake at sunrise, Nagpur"
            className="w-full h-full"
            lazy={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-900/70 to-ink-900/30" />
        </div>
        <div className="relative px-6 py-10 lg:px-10 lg:py-14 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <MapPin className="w-3 h-3" />
              Nagpur, Maharashtra
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/15">
              {PLACES.length} places indexed
            </span>
          </div>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight mb-3">
            Explore Your City.<br />Experience Nagpur.
          </h1>
          <p className="text-ink-300 text-sm lg:text-base leading-relaxed mb-5 max-w-lg">
            Heritage sites, hidden food, budget stays, and safety insights — powered by real geographic data,
            citizen reports, and verified sources.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Explore the map
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('safety')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/20 transition-colors backdrop-blur-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Safety & Evidence
            </button>
          </div>
        </div>
      </section>

      {/* Stats + Weather row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Verified places */}
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Verified Places</span>
            <ShieldCheck className="w-5 h-5 text-green-600" />
          </div>
          <p className="font-display font-bold text-3xl text-ink-900">{verifiedCount}</p>
          <p className="text-xs text-ink-400 mt-1">out of {PLACES.length} total indexed</p>
          <div className="mt-3 h-1.5 rounded-full bg-sand-100 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(verifiedCount / PLACES.length) * 100}%` }} />
          </div>
        </div>

        {/* Pending reports */}
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Pending Reports</span>
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <p className="font-display font-bold text-3xl text-ink-900">{pendingCount}</p>
          <p className="text-xs text-ink-400 mt-1">awaiting review</p>
          <button onClick={() => onNavigate('safety')} className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-3 inline-flex items-center gap-1">
            View reports <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Weather */}
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Weather</span>
            <Cloud className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="font-display font-bold text-3xl text-ink-900">{weather.temperature}</p>
            <span className="text-lg text-ink-400">°C</span>
          </div>
          <p className="text-xs text-ink-500 mt-1">{weather.condition}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-ink-400">
            <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{weather.humidity}%</span>
            <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{weather.windSpeed} km/h</span>
          </div>
          <p className="text-[10px] text-ink-300 mt-2">{weather.source}</p>
        </div>

        {/* Data freshness */}
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Data Freshness</span>
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <p className="font-display font-bold text-lg text-ink-900 leading-tight">Live Index</p>
          <p className="text-xs text-ink-400 mt-1">Sources: OSM, NMC, ASI, Citizen</p>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-medium text-teal-600">Updated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </div>

      {/* Map preview + Recent reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map preview */}
        <div className="lg:col-span-2 bg-ink-900 rounded-2xl overflow-hidden border border-ink-800 shadow-card relative">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="font-display font-semibold text-white text-lg">Nagpur Map Preview</h2>
            <p className="text-xs text-ink-400">{PLACES.length} places mapped</p>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => onNavigate('explore')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs font-medium border border-white/20 hover:bg-white/20 transition-colors"
            >
              Open full map <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <MapView
            places={PLACES}
            onSelectPlace={(id) => { onSelectPlace(id); onNavigate('explore'); }}
            className="w-full h-[300px] lg:h-[340px]"
          />
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink-900 text-lg">Recent Reports</h2>
            <button onClick={() => onNavigate('safety')} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentReports.map(report => (
              <div key={report.id} className="pb-3 border-b border-sand-100 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-ink-800 truncate">{report.placeName}</p>
                  <StatusBadge status={report.status} />
                </div>
                <p className="text-xs text-ink-500 line-clamp-2 mb-1.5">{report.description}</p>
                <div className="flex items-center gap-2 text-[10px] text-ink-400">
                  <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{report.area}</span>
                  <span>·</span>
                  <span>{report.reportedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured destinations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-ink-900">Featured Destinations</h2>
            <p className="text-sm text-ink-400 mt-0.5">Heritage, landmarks, and scenic places in Nagpur</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-sm font-medium text-teal-600 hover:text-teal-700 inline-flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => onSelectPlace(place.id)}
              onSave={() => onSave(place.id)}
              saved={savedIds.has(place.id)}
              comparing={comparingIds.has(place.id)}
            />
          ))}
        </div>
      </section>

      {/* Heritage & Food section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-ink-900">Heritage & Hidden Food</h2>
            <p className="text-sm text-ink-400 mt-0.5">Cultural landmarks and local food discoveries</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heritageFood.map(place => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={() => onSelectPlace(place.id)}
              onSave={() => onSave(place.id)}
              onCompare={() => onCompare(place.id)}
              saved={savedIds.has(place.id)}
              comparing={comparingIds.has(place.id)}
            />
          ))}
        </div>
      </section>

      {/* Category quick links */}
      <section className="bg-white rounded-2xl border border-sand-200 p-6 shadow-card">
        <h2 className="font-display font-semibold text-ink-900 text-lg mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = categoryIcons[key] || Camera;
            const count = PLACES.filter(p => p.category === key).length;
            return (
              <button
                key={key}
                onClick={() => onNavigate('explore')}
                className="group flex items-center gap-3 p-4 rounded-xl border border-sand-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-left"
              >
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${meta.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-800 group-hover:text-teal-700">{meta.label}</p>
                  <p className="text-xs text-ink-400">{count} places</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="text-center py-6">
        <p className="text-xs text-ink-400">
          Apala Nagpur · Explore Your City. Experience Nagpur. · Data from OpenStreetMap, NMC, ASI & citizen reports · Photos via Wikimedia Commons & Pexels
        </p>
      </footer>
    </div>
  );
}
