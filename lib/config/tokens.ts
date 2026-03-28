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
  heading: "'Newsreader', 'Georgia', serif",
  body:    "'Inter', system-ui, sans-serif",
} as const

// ─── Color Palette — "Library at Night" ──────────────────────────
export const COLOR = {
  // Surfaces — warm blacks
  surface0: '#0A0A08',  // warm black — behind everything
  surface1: '#121210',  // card background (no image)
  surface2: '#1C1B18',  // elevated panels
  surface3: '#262520',  // chips, secondary surfaces

  // Text hierarchy — cream-whites, not clinical
  textPrimary:   'rgba(255, 252, 245, 0.93)',
  textSecondary: 'rgba(255, 252, 245, 0.55)',
  textTertiary:  'rgba(255, 252, 245, 0.30)',

  // Brand accent — aged gold (knowledge, illumination, discovery)
  accent:       '#C4954A',
  accentLight:  '#D4AC6A',
  accentDim:    'rgba(196, 149, 74, 0.14)',
  accentBorder: 'rgba(196, 149, 74, 0.35)',

  // Streak / engagement — warm amber, harmonizes with gold
  streak:    '#E8A435',
  streakDim: 'rgba(232, 164, 53, 0.14)',

  // Structural — warm tint
  border:       'rgba(255, 252, 245, 0.07)',
  borderStrong: 'rgba(255, 252, 245, 0.13)',

  // Overlays for image cards
  overlayHeavy: 'rgba(10, 10, 8, 0.90)',
  overlayMid:   'rgba(10, 10, 8, 0.52)',
  overlayLight: 'rgba(10, 10, 8, 0.16)',
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
  label:    { size: '10.5px', lh: '1.2',  weight: '600', tracking: '0.06em' },
  caption:  { size: '12px',   lh: '1.4',  weight: '500', tracking: '0.01em' },
  body:     { size: '14.5px', lh: '1.7',  weight: '400', tracking: '0.005em' },
  description: { size: '13px', lh: '1.35', weight: '400' },
  title:    { size: '26px',  lh: '1.15', weight: '600', tracking: '-0.02em' },
  titleLg:  { size: '34px',  lh: '1.08', weight: '700', tracking: '-0.025em' },
  wordmark: { size: '20px',  lh: '1',    weight: '600', tracking: '-0.01em' },
} as const
