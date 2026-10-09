import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Place } from '@/types';
import { CATEGORY_META } from '@/types';
import { NAGPUR_CENTER, NAGPUR_ZOOM } from '@/data';

interface MapViewProps {
  places?: Place[];
  selectedId?: string | null;
  onSelectPlace?: (id: string) => void;
  className?: string;
  markers?: Array<{ lat: number; lng: number; color: string; label?: string }>;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
}

// Fix default marker icon path issue in bundler environments
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

function createIcon(color: string, active: boolean): L.DivIcon {
  return L.divIcon({
    className: 'cp-marker',
    html: `<div class="cp-marker-pin ${active ? 'active' : ''}" style="background:${color}"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 28],
    popupAnchor: [0, -28],
  });
}

export function MapView({ places = [], selectedId = null, onSelectPlace, className = '', markers = [], flyTo = null }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markerMap = useRef<Map<string, L.Marker>>(new Map());

  // Init map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, {
      center: NAGPUR_CENTER,
      zoom: NAGPUR_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!layerRef.current || !mapRef.current) return;
    layerRef.current.clearLayers();
    markerMap.current.clear();

    places.forEach(place => {
      const meta = CATEGORY_META[place.category];
      const isActive = place.id === selectedId;
      const marker = L.marker([place.lat, place.lng], {
        icon: createIcon(meta.pinColor, isActive),
      });
      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:160px">
          <div style="font-weight:600;font-size:13px;color:#0e1524;margin-bottom:2px">${place.name}</div>
          <div style="font-size:11px;color:#6a7fb0">${meta.label} · ${place.area}</div>
        </div>`,
        { closeButton: false, offset: [0, -8] }
      );
      if (onSelectPlace) {
        marker.on('click', () => onSelectPlace(place.id));
      }
      if (isActive) {
        marker.openPopup();
      }
      marker.addTo(layerRef.current!);
      markerMap.current.set(place.id, marker);
    });

    // Custom markers (safety reports, etc.)
    markers.forEach((m, idx) => {
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: 8,
        fillColor: m.color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      });
      if (m.label) {
        marker.bindPopup(m.label, { closeButton: false });
      }
      marker.addTo(layerRef.current!);
      void idx;
    });
  }, [places, selectedId, markers, onSelectPlace]);

  // Fly to selected place or explicit flyTo
  useEffect(() => {
    if (!mapRef.current) return;
    if (flyTo) {
      mapRef.current.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom ?? 15, { duration: 0.8 });
      return;
    }
    if (selectedId) {
      const place = places.find(p => p.id === selectedId);
      if (place) {
        mapRef.current.flyTo([place.lat, place.lng], 15, { duration: 0.6 });
      }
    }
  }, [selectedId, flyTo, places]);

  return <div ref={containerRef} className={className} />;
}
