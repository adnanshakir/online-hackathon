/**
 * Tiny localStorage wrapper. Returns fallback on parse errors / SSR.
 */
export function readStorage(key, fallback = null) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently drop */
  }
}

export function removeStorage(key) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}
