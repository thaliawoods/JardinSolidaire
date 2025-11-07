// frontend/src/components/Map/GardensMap.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Do NOT import 'leaflet' or its CSS at the top level.
// Add Leaflet CSS once in app/layout.js:
// <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

// react-leaflet must be SSR-disabled
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import('react-leaflet').then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

/**
 * Props:
 * - height: CSS height (e.g. '360px' or '60vh')
 * - fullPage: boolean → when true, fills the viewport below the navbar
 */
export default function GardensMap({ height = '360px', fullPage = false }) {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [ready, setReady] = useState(false); // leaflet assets ready

  // Load gardens with coordinates from the API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gardens`, { cache: 'no-store' });
        const data = await res.json().catch(() => []);
        if (!alive) return;

        const list = Array.isArray(data?.gardens) ? data.gardens : Array.isArray(data) ? data : [];
        // Normalize lat/lng in case they come as strings
        const cleaned = list
          .map(g => ({
            ...g,
            lat: typeof g.lat === 'string' ? parseFloat(g.lat) : g.lat,
            lng: typeof g.lng === 'string' ? parseFloat(g.lng) : g.lng,
          }))
          .filter(g => Number.isFinite(g.lat) && Number.isFinite(g.lng));

        setGardens(cleaned);
      } catch {
        if (alive) setGardens([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Load Leaflet on the client and set default icons
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === 'undefined') return;
      const L = (await import('leaflet')).default;

      const DefaultIcon = L.icon({
        iconUrl: '/leaflet/marker-icon.png',
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        shadowUrl: '/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      if (!mounted) return;
      setReady(true);
    })();
    return () => { mounted = false; };
  }, []);

  // Optional browser geolocation
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  }, []);

  const center = useMemo(() => {
    if (userPos) return [userPos.lat, userPos.lng];
    if (gardens.length > 0) return [gardens[0].lat, gardens[0].lng];
    return [48.8566, 2.3522]; // Paris fallback
  }, [userPos, gardens]);

  const mapHeight = fullPage ? 'calc(100vh - 64px)' : height;

  // Wait until Leaflet is ready before rendering the map
  if (!ready) {
    return (
      <div className="relative rounded-xl overflow-hidden border" style={{ height: mapHeight }}>
        <div className="absolute inset-0 grid place-items-center bg-white/60 text-sm">
          Chargement de la carte…
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border" style={{ height: mapHeight }}>
      <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        {gardens.map(g => (
          <Marker key={g.id} position={[g.lat, g.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{g.title || 'Jardin'}</div>
                {g.address && <div className="text-gray-600">{g.address}</div>}
                <a className="text-pink-600 hover:underline" href={`/gardens/${g.id}`}>
                  Voir le jardin
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {loading && (
        <div className="absolute inset-0 grid place-items-center bg-white/60 text-sm">
          Chargement de la carte…
        </div>
      )}
    </div>
  );
}
