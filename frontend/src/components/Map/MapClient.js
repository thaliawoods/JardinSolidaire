// src/components/map/MapClient.js
'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Load react-leaflet only on the client
const RL = {
  MapContainer: dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false }),
  TileLayer:    dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false }),
  Marker:       dynamic(() => import('react-leaflet').then(m => m.Marker),       { ssr: false }),
  Popup:        dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false }),
};

export default function MapClient({ center = [48.8566, 2.3522], zoom = 12, markers = [] }) {
  // Defer any 'window' or 'leaflet' usage until mounted
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Configure Leaflet default icons when in the browser
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
      setReady(true);
    })();
  }, []);

  const points = useMemo(() => Array.isArray(markers) ? markers : [], [markers]);

  if (!ready) return null;

  const { MapContainer, TileLayer, Marker, Popup } = RL;

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
      <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lng]}>
            {p.label ? <Popup>{p.label}</Popup> : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
