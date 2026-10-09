import { useState, useMemo } from 'react';
import { MapPin, Clock, FileText, AlertTriangle, Info, Filter, Inbox } from 'lucide-react';
import { SAFETY_REPORTS } from '@/data';
import { StatusBadge, Badge } from '@/components/Badge';
import { MapView } from '@/components/MapView';
import { FilterChips, type FilterChipOption } from '@/components/FilterChips';

interface SafetyProps {
  onSelectPlace: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  infrastructure: 'Infrastructure',
  sanitation: 'Sanitation',
  safety: 'Public Safety',
  environment: 'Environment',
  other: 'Other',
};

const STATUS_OPTIONS: FilterChipOption[] = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'unknown', label: 'Unknown' },
];

export function Safety({ onSelectPlace }: SafetyProps) {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return SAFETY_REPORTS.filter(r => {
      if (statusFilter.length > 0 && !statusFilter.includes(r.status)) return false;
      return true;
    });
  }, [statusFilter]);

  const reportMarkers = filtered.map(r => ({
    lat: r.lat,
    lng: r.lng,
    color: r.status === 'verified' ? '#16a34a' : r.status === 'pending' ? '#d97706' : r.status === 'rejected' ? '#dc2626' : '#6a7fb0',
    label: `<div style="font-family:Inter,sans-serif"><div style="font-weight:600;font-size:13px">${r.placeName}</div><div style="font-size:11px;color:#6a7fb0">${CATEGORY_LABELS[r.category]} · ${r.status}</div></div>`,
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-ink-900 mb-1">Safety & Evidence</h1>
        <p className="text-sm text-ink-500">
          Citizen reports and verified safety information for Nagpur destinations. Unverified reports are clearly distinguished from confirmed incidents.
        </p>
      </div>

      {/* Trust note */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-sky-900">How to read these reports</p>
          <p className="text-xs text-sky-700 mt-1 leading-relaxed">
            Each report shows its verification status, source, and evidence count. "Pending Review" means a citizen report that has not yet been verified by authorities — it is not a confirmed incident. "Verified" indicates corroboration by an official source.
          </p>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(['pending', 'verified', 'rejected', 'unknown'] as const).map(status => {
          const count = SAFETY_REPORTS.filter(r => r.status === status).length;
          return (
            <div key={status} className="bg-white rounded-xl border border-sand-200 p-4 shadow-card">
              <div className="mb-2">
                <StatusBadge status={status} />
              </div>
              <p className="font-display font-bold text-2xl text-ink-900">{count}</p>
              <p className="text-xs text-ink-400 mt-0.5">reports</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-start gap-2">
        <Filter className="w-4 h-4 text-ink-400 mt-1.5 flex-shrink-0" />
        <FilterChips options={STATUS_OPTIONS} selected={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* Map + Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Map */}
        <div className="bg-ink-900 rounded-2xl overflow-hidden border border-ink-800 shadow-card h-[400px] lg:h-auto relative">
          <div className="absolute top-4 left-4 z-10">
            <h2 className="font-display font-semibold text-white text-base">Report Locations</h2>
            <p className="text-xs text-ink-400">{filtered.length} reports mapped</p>
          </div>
          <MapView
            markers={reportMarkers}
            className="w-full h-full"
          />
        </div>

        {/* Reports list */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-sand-200">
              <Inbox className="w-10 h-10 text-ink-300 mb-3" />
              <p className="text-sm font-medium text-ink-500">No reports match your filters</p>
              <button
                onClick={() => setStatusFilter([])}
                className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(report => {
              const isSelected = report.id === selectedReport;
              return (
                <div
                  key={report.id}
                  onClick={() => { setSelectedReport(report.id); }}
                  className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                    isSelected ? 'border-teal-300 shadow-glow-teal' : 'border-sand-200 hover:shadow-card'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-ink-800 truncate">{report.placeName}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-ink-400 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{report.area}</span>
                      </div>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  <p className="text-sm text-ink-600 leading-relaxed mb-3">{report.description}</p>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Badge variant="neutral">{CATEGORY_LABELS[report.category]}</Badge>
                    <span className="flex items-center gap-1 text-ink-400">
                      <Clock className="w-3 h-3" />
                      {report.reportedAt}
                    </span>
                    <span className="flex items-center gap-1 text-ink-400">
                      <FileText className="w-3 h-3" />
                      {report.evidenceCount} evidence
                    </span>
                    <span className="text-ink-400">· {report.source}</span>
                  </div>

                  {report.placeId && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectPlace(report.placeId!); }}
                      className="text-xs text-teal-600 hover:text-teal-700 font-medium mt-3 inline-flex items-center gap-1"
                    >
                      View place details
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Evidence completeness note */}
      <div className="bg-sand-100 border border-sand-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h2 className="font-display font-semibold text-ink-800 text-sm">Evidence vs. Safety</h2>
        </div>
        <p className="text-xs text-ink-600 leading-relaxed">
          Evidence completeness (number of corroborating reports) is separate from actual safety.
          A verified report means an authority has confirmed the issue exists — it does not mean the location is unsafe.
          Similarly, the absence of reports does not guarantee safety. Use these reports as one input among many when planning visits.
        </p>
      </div>

      <footer className="text-center py-4">
        <p className="text-xs text-ink-400">
          Apala Nagpur · Safety & Evidence · Reports from citizen submissions and NMC public data. Unverified reports are clearly labeled and should not be treated as confirmed incidents.
        </p>
      </footer>
    </div>
  );
}
