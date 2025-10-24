// backend/utils.js

// Simple sleep helper (for rate limiting backfills)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Geocode an address via OpenStreetMap Nominatim.
 * Returns { lat, lng } or null.
 * Be gentle with their rate limits.
 */
async function geocodeAddress(address) {
  if (!address || typeof address !== 'string') return null;

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', address);

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'JardinSolidaire/1.0 (contact: admin@jardinsolidaire.local)',
      'Accept-Language': 'fr',
    },
  }).catch(() => null);

  if (!res || !res.ok) return null;

  const data = await res.json().catch(() => null);
  if (!Array.isArray(data) || data.length === 0) return null;

  const first = data[0];
  const lat = Number(first.lat);
  const lng = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
}

module.exports = { geocodeAddress, sleep };
