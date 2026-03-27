// ─────────────────────────────────────────────────────────────────
// STORAGE ADAPTER — the single swap point for V1 → V2 upgrade.
//
// V1 (current): uses localStorage, works offline, no backend needed.
// V2 (future):  swap this one export to apiAdapter and implement
//               apiAdapter.ts to call your backend (any language/framework).
//
// Example V2 swap:
//   export { apiAdapter as storage } from './apiAdapter'
// ─────────────────────────────────────────────────────────────────

export { localAdapter as storage } from "./localAdapter";
export type { StorageAdapter } from "./localAdapter";
