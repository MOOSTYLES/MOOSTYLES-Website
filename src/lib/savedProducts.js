import { getProductById } from "./shoppingData";

const STORAGE_KEY = 'moostyle_saved_products';
const EXPIRATION_DAYS = 365 * 2;

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (!match) return null;
  return decodeURIComponent(match[2]);
}

function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function nowISO() {
  return new Date().toISOString();
}

function defaultSavedEntry(id) {
  return {
    id,
    savedAt: nowISO(),
    expiresAt: new Date(Date.now() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
  };
}

function loadRawSaved() {
  try {
    const raw = getCookie(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Entries saved under a pre-renumbering ID (e.g. archive-017) are rewritten
    // to the mod's current ID, so the heart toggle and unsave match them again.
    let migrated = false;
    const entries = parsed.map((entry) => {
      const currentId = getProductById(entry.id)?.id;
      if (!currentId || currentId === entry.id) return entry;
      migrated = true;
      return { ...entry, id: currentId };
    });
    if (migrated) saveRawSaved(entries);
    return entries;
  } catch (e) {
    console.error('Error parsing saved products cookie:', e);
    return [];
  }
}

function saveRawSaved(arr) {
  try {
    setCookie(STORAGE_KEY, JSON.stringify(arr), EXPIRATION_DAYS);
    window.dispatchEvent(new CustomEvent('savedProductsChanged'));
  } catch (e) {
    console.error('Error saving saved products cookie:', e);
  }
}

export function saveProduct(product) {
  if (!product || !product.id) return false;
  const raw = loadRawSaved();
  const existing = raw.findIndex(e => e.id === product.id);
  if (existing !== -1) {
    raw[existing] = { ...raw[existing], savedAt: nowISO(), expiresAt: new Date(Date.now() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString() };
  } else {
    raw.push(defaultSavedEntry(product.id));
  }
  saveRawSaved(raw);
  return true;
}

export function unsaveProduct(productId) {
  const raw = loadRawSaved();
  const filtered = raw.filter(e => e.id !== productId);
  if (filtered.length === raw.length) return false;
  saveRawSaved(filtered);
  return true;
}

export function isProductSaved(productId) {
  const raw = loadRawSaved();
  return raw.some(e => e.id === productId && new Date(e.expiresAt) > new Date());
}

export function getSavedProducts() {
  const raw = loadRawSaved();
  const now = new Date();
  const valid = raw.filter(e => new Date(e.expiresAt) > now);
  if (valid.length !== raw.length) saveRawSaved(valid);

  const products = valid.map(entry => {
    const p = getProductById(entry.id);
    if (!p) return null;
    return { ...p, savedAt: entry.savedAt, expiresAt: entry.expiresAt };
  }).filter(Boolean);

  return products;
}

export function clearAllSavedProducts() {
  deleteCookie(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('savedProductsChanged'));
}
