// Fallback gradient palettes for articles without thumbnails.
// Selected by colorSeed (0–5), which is derived from the article title hash.
// Warm-toned to match the "Library at Night" palette.

export const GRADIENTS: string[] = [
  // 0 — burnt sienna
  'linear-gradient(160deg, #1e1410 0%, #140e0a 60%, #0A0A08 100%)',
  // 1 — deep olive
  'linear-gradient(160deg, #161a0e 0%, #10130a 60%, #0A0A08 100%)',
  // 2 — warm charcoal
  'linear-gradient(160deg, #1a1610 0%, #12100c 60%, #0A0A08 100%)',
  // 3 — clay
  'linear-gradient(160deg, #1e1412 0%, #15100e 60%, #0A0A08 100%)',
  // 4 — aged bronze
  'linear-gradient(160deg, #1a1810 0%, #13110c 60%, #0A0A08 100%)',
  // 5 — parchment dark
  'linear-gradient(160deg, #1c1a14 0%, #14130e 60%, #0A0A08 100%)',
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
