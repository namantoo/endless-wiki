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

// ─── Color Palette — "Editorial Pop" ─────────────────────────────
export const COLOR = {
  // Surfaces — pure blacks
  surface0: '#0D0D0D',  // pure black — behind everything
  surface1: '#161616',  // card background (no image)
  surface2: '#202020',  // elevated panels
  surface3: '#2B2B2B',  // chips, secondary surfaces

  // Text hierarchy — pure whites
  textPrimary:   'rgba(255, 255, 255, 0.94)',
  textSecondary: 'rgba(255, 255, 255, 0.58)',
  textTertiary:  'rgba(255, 255, 255, 0.32)',

  // Brand accent — electric lime (punchy, fun, discovery energy)
  accent:       '#C6FF47',
  accentLight:  '#D4FF70',
  accentDim:    'rgba(198, 255, 71, 0.12)',
  accentBorder: 'rgba(198, 255, 71, 0.38)',

  // Streak / engagement — vivid orange, distinct from lime
  streak:    '#FF9F47',
  streakDim: 'rgba(255, 159, 71, 0.14)',

  // Structural
  border:       'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',

  // Overlays for image cards
  overlayHeavy: 'rgba(13, 13, 13, 0.90)',
  overlayMid:   'rgba(13, 13, 13, 0.52)',
  overlayLight: 'rgba(13, 13, 13, 0.16)',
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
