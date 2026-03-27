// localStorage adapter — V1 storage implementation.
// All reads/writes go through this interface.
// To upgrade to a backend: implement apiAdapter.ts with the same interface,
// then change lib/storage/index.ts to export that instead.

export interface StorageAdapter {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}

function safeGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or private browsing — fail silently
  }
}

function safeRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}

export const localAdapter: StorageAdapter = {
  get: safeGet,
  set: safeSet,
  remove: safeRemove,
};
