// src/lib/favorites.js

// Two independent keys so gardens/gardeners don’t collide
export const FAV_GARDENS_KEY = 'favGardens';
export const FAV_GARDENERS_KEY = 'favGardeners';

// ---- low-level utils ----
function safeParse(raw, fallback = []) {
  try {
    const v = JSON.parse(raw ?? 'null');
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
}
function read(key) {
  if (typeof window === 'undefined') return [];
  return safeParse(localStorage.getItem(key));
}
function write(key, arr) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(arr)); } catch {}
}
function toId(v) { return String(v?.id ?? v); }

// ---- Gardens ----
export function getFavGardens() {
  return read(FAV_GARDENS_KEY);
}
export function addFavGarden(garden) {
  const list = getFavGardens();
  const id = toId(garden);
  if (!list.some((g) => String(g.id) === id)) {
    list.push({
      id,
      title: garden.title ?? '',
      address: garden.address ?? '',
      kind: garden.kind ?? '',
      photos: Array.isArray(garden.photos) ? garden.photos : [],
    });
    write(FAV_GARDENS_KEY, list);
  }
  return list;
}
export function removeFavGarden(gardenOrId) {
  const id = toId(gardenOrId);
  const list = getFavGardens().filter((g) => String(g.id) !== id);
  write(FAV_GARDENS_KEY, list);
  return list;
}

// ---- Gardeners ----
export function getFavGardeners() {
  return read(FAV_GARDENERS_KEY);
}
export function addFavGardener(gardener) {
  const list = getFavGardeners();
  const id = toId(gardener);
  if (!list.some((g) => String(g.id) === id)) {
    list.push({
      id,
      firstName: gardener.firstName ?? '',
      lastName: gardener.lastName ?? '',
      avatarUrl: gardener.avatarUrl ?? null,
      rating: gardener.rating ?? null,
      address: gardener.address ?? '',
    });
    write(FAV_GARDENERS_KEY, list);
  }
  return list;
}
export function removeFavGardener(gardenerOrId) {
  const id = toId(gardenerOrId);
  const list = getFavGardeners().filter((g) => String(g.id) !== id);
  write(FAV_GARDENERS_KEY, list);
  return list;
}

// ---- Bulk ----
export function clearAllFavorites() {
  write(FAV_GARDENS_KEY, []);
  write(FAV_GARDENERS_KEY, []);
}
