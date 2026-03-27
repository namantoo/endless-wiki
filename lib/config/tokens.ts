// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS — Single source of truth for all design decisions.
//
// To change a color:  edit COLOR.*
// To change a font:   edit FONT.*
// To change spacing:  edit SPACE.*
// To change type:     edit TYPE.*
//
// CSS custom properties in globals.css mirror these values.
// Components import from here or use Tailwind classes backed by these.
// ─────────────────────────────────────────────────────────────────

// ─── Typography ───────────────────────────────────────────────────
export const FONT = {
  heading: "'Space Grotesk', system-ui, sans-serif",
  body:    "'Inter', system-ui, sans-serif",
} as const

// ─── Color Palette ────────────────────────────────────────────────
export const COLOR = {
  // Surfaces — dark-first, no light mode in V1
  surface0: '#080808',  // true black — behind everything
  surface1: '#111111',  // card background (no image)
  surface2: '#1a1a1a',  // elevated panels, expand drawer
  surface3: '#252525',  // chips, secondary actions

  // Text hierarchy
  textPrimary:   'rgba(255,255,255,0.95)',
  textSecondary: 'rgba(255,255,255,0.60)',
  textTertiary:  'rgba(255,255,255,0.35)',

  // Brand accent — electric violet, distinct from every other dark app
  accent:       '#7C5CFC',
  accentLight:  '#9B84FD',
  accentDim:    'rgba(124,92,252,0.18)',
  accentBorder: 'rgba(124,92,252,0.45)',

  // Streak / engagement
  streak:    '#F5A623',              // amber — fire icon, streak counter
  streakDim: 'rgba(245,166,35,0.16)',

  // Structural
  border:       'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',

  // Overlays for image cards
  overlayHeavy: 'rgba(0,0,0,0.90)',
  overlayMid:   'rgba(0,0,0,0.52)',
  overlayLight: 'rgba(0,0,0,0.16)',
} as const

// ─── Spacing ──────────────────────────────────────────────────────
export const SPACE = {
  xs:   '4px',
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const

// ─── Border Radius ────────────────────────────────────────────────
export const RADIUS = {
  sm:   '6px',
  md:   '10px',
  lg:   '14px',
  full: '9999px',
} as const

// ─── Type Scale ───────────────────────────────────────────────────
export const TYPE = {
  label:    { size: '11px', lh: '1.2',  weight: '600', tracking: '0.08em' },
  caption:  { size: '13px', lh: '1.4',  weight: '400' },
  body:     { size: '15px', lh: '1.65', weight: '400' },
  title:    { size: '28px', lh: '1.15', weight: '700' },
  titleLg:  { size: '34px', lh: '1.1',  weight: '700' },
  wordmark: { size: '18px', lh: '1',    weight: '700' },
} as const
