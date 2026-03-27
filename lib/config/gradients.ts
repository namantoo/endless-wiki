// Fallback gradient palettes for articles without thumbnails.
// Selected by colorSeed (0–5), which is derived from the article title hash.
// These are intentional, branded — not a fallback that looks broken.

export const GRADIENTS: string[] = [
  // 0 — deep teal
  'linear-gradient(160deg, #0d2c2e 0%, #0a1a1b 60%, #080808 100%)',
  // 1 — indigo/navy
  'linear-gradient(160deg, #111638 0%, #0c1029 60%, #080808 100%)',
  // 2 — charcoal warm
  'linear-gradient(160deg, #1e1610 0%, #14100a 60%, #080808 100%)',
  // 3 — forest
  'linear-gradient(160deg, #0d1f12 0%, #09160d 60%, #080808 100%)',
  // 4 — burgundy
  'linear-gradient(160deg, #1e0d14 0%, #150910 60%, #080808 100%)',
  // 5 — slate blue
  'linear-gradient(160deg, #111826 0%, #0c1219 60%, #080808 100%)',
]

/** Returns a gradient string for a given seed (0–5). */
export function getGradient(seed: number): string {
  return GRADIENTS[seed % GRADIENTS.length]
}

/** Derives a stable color seed (0–5) from an article title. */
export function colorSeedFromTitle(title: string): number {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash + title.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % GRADIENTS.length
}
