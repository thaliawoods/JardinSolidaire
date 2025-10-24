// backend/lib/geocode.js
const isProd = process.env.NODE_ENV === 'production';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Basic normalization that helps some providers
function normalizeAddress(input) {
  if (!input) return '';
  let s = String(input).trim();
  // remove extra spaces
  s = s.replace(/\s+/g, ' ');
  // normalize common FR street words
  s = s.replace(/\b(r|rue|av|avenue|bd|boulevard|imp|impasse|pl|place)\b/gi, (m) => m.toLowerCase());
  return s;
}

/** ---- Providers -------------------------------------------------------- **/

async function geocodeWithNominatim(q) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(q);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'JardinSolidaire/1.0 (contact: admin@jardinsolidaire.local)',
      'Accept': 'application/json',
    },
  });
  if (!res.ok) return null;
  const arr = await res.json().catch(() => []);
  const hit = Array.isArray(arr) && arr[0] ? arr[0] : null;
  if (!hit) return null;
  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng, provider: 'nominatim' } : null;
}

async function geocodeWithBAN(q) {
  // France official geocoding service
  const url = 'https://api-adresse.data.gouv.fr/search/?limit=1&q=' + encodeURIComponent(q);
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const feat = data?.features?.[0];
  const coords = feat?.geometry?.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return null;
  const [lng, lat] = coords.map(Number);
  return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng, provider: 'ban' } : null;
}

async function geocodeWithOpenCage(q) {
  const key = process.env.OPENCAGE_API_KEY;
  if (!key) return null;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(q)}&limit=1&no_annotations=1&key=${key}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const hit = data?.results?.[0]?.geometry;
  const lat = Number(hit?.lat);
  const lng = Number(hit?.lng);
  return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng, provider: 'opencage' } : null;
}

async function geocodeWithGoogle(q) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${key}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const loc = data?.results?.[0]?.geometry?.location;
  const lat = Number(loc?.lat);
  const lng = Number(loc?.lng);
  return (Number.isFinite(lat) && Number.isFinite(lng)) ? { lat, lng, provider: 'google' } : null;
}

/** ---- Main exported function ------------------------------------------ **/

/**
 * Try multiple providers. Returns { lat, lng, provider } or null
 */
async function geocodeAddress(addressRaw) {
  const q = normalizeAddress(addressRaw);
  if (!q) return null;

  // 1) Nominatim
  try {
    const hit = await geocodeWithNominatim(q);
    if (hit) return hit;
  } catch (_) {}
  // Be gentle
  await sleep(250);

  // 2) BAN (French addresses are much more reliable here)
  try {
    const hit = await geocodeWithBAN(q);
    if (hit) return hit;
  } catch (_) {}
  await sleep(250);

  // 3) OpenCage (if key set)
  try {
    const hit = await geocodeWithOpenCage(q);
    if (hit) return hit;
  } catch (_) {}
  await sleep(250);

  // 4) Google (if key set)
  try {
    const hit = await geocodeWithGoogle(q);
    if (hit) return hit;
  } catch (_) {}

  return null;
}

module.exports = { geocodeAddress };
