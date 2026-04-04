'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then(m => m.TileLayer),    { ssr: false });
const Marker       = dynamic(() => import('react-leaflet').then(m => m.Marker),       { ssr: false });
const Popup        = dynamic(() => import('react-leaflet').then(m => m.Popup),        { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function GardensMap({ height = '360px', fullPage = false }) {
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);
  const [ready, setReady] = useState(false);
  const [geoAsked, setGeoAsked] = useState(false);
  const [showGeoBanner, setShowGeoBanner] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/gardens`, { cache: 'no-store' });
        const data = await res.json().catch(() => []);
        if (!alive) return;

        const list = Array.isArray(data?.gardens) ? data.gardens : Array.isArray(data) ? data : [];
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

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    // Check if permission was already granted
    navigator.permissions?.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'granted') {
        navigator.geolocation.getCurrentPosition(
          pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => {},
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
        setGeoAsked(true);
      } else if (result.state === 'prompt') {
        setShowGeoBanner(true);
      }
    }).catch(() => {
      // permissions API not supported, show banner
      if (!geoAsked) setShowGeoBanner(true);
    });
  }, [geoAsked]);

  function handleGeoAccept() {
    setShowGeoBanner(false);
    setGeoAsked(true);
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  }

  function handleGeoDismiss() {
    setShowGeoBanner(false);
    setGeoAsked(true);
  }

  const center = useMemo(() => {
    if (userPos) return [userPos.lat, userPos.lng];
    if (gardens.length > 0) return [gardens[0].lat, gardens[0].lng];
    return [48.8566, 2.3522];
  }, [userPos, gardens]);

  const mapHeight = fullPage ? 'calc(100vh - 64px)' : height;

  const frameClass =
    'relative w-full max-w-full min-w-0 overflow-hidden border border-gray-200';

  if (!ready) {
    return (
      <div
        className={frameClass}
        style={{ height: mapHeight, width: '100%', maxWidth: '100%', isolation: 'isolate' }}
      >
        <div className="absolute inset-0 grid place-items-center bg-white/60 text-sm">
          Chargement de la carte…
        </div>
      </div>
    );
  }

  return (
    <div
      className={frameClass}
      style={{ height: mapHeight, width: '100%', maxWidth: '100%', isolation: 'isolate' }}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="w-full h-full"
        style={{ height: '100%', width: '100%', maxWidth: '100%' }}
      >
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

      {showGeoBanner && (
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#fff',
          border: '1px solid var(--border, #d4d4d4)',
          borderRadius: '8px',
          padding: '0.85rem 1.1rem',
          maxWidth: '360px',
          width: 'calc(100% - 2rem)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: 'var(--foreground, #111)',
        }}>
          <p style={{ margin: '0 0 0.6rem' }}>
            <strong style={{ color: 'var(--green, #2d6a4f)' }}>Localisation</strong>{' — '}
            Pour vous montrer les jardins proches de chez vous, nous avons besoin de votre position.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={handleGeoDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted, #6b7280)',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '0.35rem 0.6rem',
              }}
            >
              Non merci
            </button>
            <button
              onClick={handleGeoAccept}
              style={{
                background: 'var(--green, #2d6a4f)',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                padding: '0.35rem 0.85rem',
              }}
            >
              Autoriser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
