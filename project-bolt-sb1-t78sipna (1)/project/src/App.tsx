import { useState, useCallback, useEffect } from 'react';
import { Sidebar, type View } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { PlaceDetailDrawer } from '@/components/PlaceDetailDrawer';
import { Dashboard } from '@/views/Dashboard';
import { Explore } from '@/views/Explore';
import { Safety } from '@/views/Safety';
import { Compare } from '@/views/Compare';
import { getPlaceById } from '@/data';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  // Persisted saved & comparing sets via localStorage
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('apala_saved');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const [comparingIds, setComparingIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('apala_comparing');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem('apala_saved', JSON.stringify([...savedIds]));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('apala_comparing', JSON.stringify([...comparingIds]));
  }, [comparingIds]);

  const handleSave = useCallback((id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleCompare = useCallback((id: string) => {
    setComparingIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleSelectPlace = useCallback((id: string) => {
    setSelectedPlaceId(id);
  }, []);

  const handleNavigate = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const selectedPlace = selectedPlaceId ? getPlaceById(selectedPlaceId) ?? null : null;

  return (
    <div className="min-h-screen bg-sand-50 flex">
      <Sidebar
        current={view}
        onNavigate={handleNavigate}
        savedCount={savedIds.size}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuClick={() => setMobileSidebarOpen(true)}
          onSelectPlace={handleSelectPlace}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-x-hidden">
          {view === 'dashboard' && (
            <Dashboard
              onSelectPlace={handleSelectPlace}
              onNavigate={handleNavigate}
              onSave={handleSave}
              onCompare={handleCompare}
              savedIds={savedIds}
              comparingIds={comparingIds}
            />
          )}
          {view === 'explore' && (
            <Explore
              selectedId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              onSave={handleSave}
              onCompare={handleCompare}
              savedIds={savedIds}
              comparingIds={comparingIds}
            />
          )}
          {view === 'safety' && (
            <Safety onSelectPlace={handleSelectPlace} />
          )}
          {view === 'compare' && (
            <Compare
              comparingIds={comparingIds}
              onRemovePlace={handleCompare}
              onAddPlace={handleCompare}
              onSelectPlace={handleSelectPlace}
            />
          )}
        </main>
      </div>

      <PlaceDetailDrawer
        place={selectedPlace}
        onClose={() => setSelectedPlaceId(null)}
        onSave={handleSave}
        onCompare={handleCompare}
        onSelectPlace={handleSelectPlace}
        saved={selectedPlace ? savedIds.has(selectedPlace.id) : false}
        comparing={selectedPlace ? comparingIds.has(selectedPlace.id) : false}
      />
    </div>
  );
}

export default App;
