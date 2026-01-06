// /frontend/src/lib/favorites.js

const LEGACY_KEY = 'js:favorites'; // ancien key global (si tu en avais un)
const KEY_PREFIX = 'js:favorites:'; // nouveau key par user

/* ---------------- helpers ---------------- */

function safeJsonParse(s, fallback) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

/**
 * Essaie de récupérer un userId depuis :
 * - localStorage.user / localStorage.currentUser / localStorage.auth
 * - ou depuis un JWT stocké (token/jwt/accessToken)
 *
 * 👉 adapte les noms si ton projet stocke autrement,
 * mais ce helper couvre pas mal de cas.
 */
function getCurrentUserId() {
  if (typeof window === 'undefined') return null;

  const directCandidates = ['user', 'currentUser', 'me'];
  for (const k of directCandidates) {
    const raw = window.localStorage.getItem(k);
    if (!raw) continue;
    const obj = safeJsonParse(raw, null);
    if (obj?.id != null) return String(obj.id);
    if (obj?.user?.id != null) return String(obj.user.id);
  }

  // auth object
  const authRaw = window.localStorage.getItem('auth');
  if (authRaw) {
    const auth = safeJsonParse(authRaw, null);
    if (auth?.user?.id != null) return String(auth.user.id);
    if (auth?.id != null) return String(auth.id);
    if (auth?.token) {
      const fromJwt = getUserIdFromJwt(auth.token);
      if (fromJwt) return fromJwt;
    }
  }

  // token alone
  const tokenCandidates = ['token', 'jwt', 'accessToken'];
  for (const k of tokenCandidates) {
    const t = window.localStorage.getItem(k);
    const fromJwt = getUserIdFromJwt(t);
    if (fromJwt) return fromJwt;
  }

  return null;
}

function base64UrlDecode(str) {
  try {
    const s = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
    const decoded = atob(s + pad);
    return decoded;
  } catch {
    return null;
  }
}

function getUserIdFromJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = base64UrlDecode(parts[1]);
  if (!payload) return null;
  const obj = safeJsonParse(payload, null);
  if (!obj) return null;

  // champs fréquents
  if (obj.userId != null) return String(obj.userId);
  if (obj.id != null) return String(obj.id);
  if (obj.sub != null) return String(obj.sub);

  // parfois: { user: { id } }
  if (obj.user?.id != null) return String(obj.user.id);

  return null;
}

function getStorageKey(userId) {
  const uid = userId || getCurrentUserId() || 'guest';
  return `${KEY_PREFIX}${uid}`;
}

function readStore(userId) {
  if (typeof window === 'undefined') return { gardens: [], gardeners: [] };

  const key = getStorageKey(userId);

  // Migration: si le nouveau key est vide mais l'ancien existe, on copie
  const existing = window.localStorage.getItem(key);
  if (!existing) {
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      window.localStorage.setItem(key, legacy);
      // option: tu peux laisser l'ancien pour ne rien casser
      // window.localStorage.removeItem(LEGACY_KEY);
    }
  }

  const raw = window.localStorage.getItem(key);
  const parsed = safeJsonParse(raw, null);

  // format attendu: { gardens: [], gardeners: [] }
  if (parsed && typeof parsed === 'object') {
    return {
      gardens: Array.isArray(parsed.gardens) ? parsed.gardens : [],
      gardeners: Array.isArray(parsed.gardeners) ? parsed.gardeners : [],
    };
  }

  return { gardens: [], gardeners: [] };
}

function writeStore(next, userId) {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  window.localStorage.setItem(
    key,
    JSON.stringify({
      gardens: Array.isArray(next?.gardens) ? next.gardens : [],
      gardeners: Array.isArray(next?.gardeners) ? next.gardeners : [],
    })
  );
}

/* ---------------- public API (gardens) ---------------- */

export function getFavGardens(userId) {
  return readStore(userId).gardens;
}

export function addFavGarden(garden, userId) {
  const store = readStore(userId);
  const id = garden?.id;
  if (id == null) return;

  const exists = store.gardens.some((g) => String(g.id) === String(id));
  if (exists) return;

  store.gardens.unshift(garden);
  writeStore(store, userId);
}

export function removeFavGarden(id, userId) {
  const store = readStore(userId);
  store.gardens = store.gardens.filter((g) => String(g.id) !== String(id));
  writeStore(store, userId);
}

export function isFavGarden(id, userId) {
  const store = readStore(userId);
  return store.gardens.some((g) => String(g.id) === String(id));
}

/* ---------------- public API (gardeners) ---------------- */

export function getFavGardeners(userId) {
  return readStore(userId).gardeners;
}

export function addFavGardener(gardener, userId) {
  const store = readStore(userId);
  const id = gardener?.id;
  if (id == null) return;

  const exists = store.gardeners.some((p) => String(p.id) === String(id));
  if (exists) return;

  store.gardeners.unshift(gardener);
  writeStore(store, userId);
}

export function removeFavGardener(id, userId) {
  const store = readStore(userId);
  store.gardeners = store.gardeners.filter((p) => String(p.id) !== String(id));
  writeStore(store, userId);
}

export function isFavGardener(id, userId) {
  const store = readStore(userId);
  return store.gardeners.some((p) => String(p.id) === String(id));
}

/* ---------------- misc ---------------- */

export function clearAllFavorites(userId) {
  writeStore({ gardens: [], gardeners: [] }, userId);
}

// si tu veux explicitement connaître l'userId détecté côté UI
export function getFavoritesOwnerId() {
  return getCurrentUserId() || 'guest';
}
