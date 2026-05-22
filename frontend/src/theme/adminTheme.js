// ─── Central Admin Theme ───────────────────────────────────────
// Import this in any admin component instead of hardcoding colors

export const COLORS = {
  primary:     '#7c3aed',
  primaryDark: '#5b21b6',
  primaryDim:  '#4c1d95',
  accent:      '#a78bfa',
  light:       '#f5f3ff',
  border:      '#ddd6fe',

  success:     '#22c55e',
  successBg:   '#dcfce7',
  successText: '#16a34a',

  warning:     '#f59e0b',
  warningBg:   '#fef3c7',
  warningText: '#d97706',

  danger:      '#ef4444',
  dangerBg:    '#fee2e2',
  dangerText:  '#dc2626',

  blue:        '#0891b2',
  blueBg:      '#eff6ff',

  gray50:  '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  white: '#ffffff',
};

export const GRADIENTS = {
  admin: 'linear-gradient(135deg, #1e0b4b 0%, #2e1065 25%, #4c1d95 55%, #6d28d9 80%, #7c3aed 100%)',
};

export const SHADOWS = {
  card:    '0 1px 4px rgba(0,0,0,0.06)',
  cardMd:  '0 1px 4px rgba(0,0,0,0.07)',
  purple:  '0 6px 28px rgba(124,58,237,0.3)',
  hero:    '0 8px 32px rgba(0,0,0,0.18)',
};

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  22,
  xxl: 28,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', color: '#111827' },
  h2: { fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px', color: '#111827' },
  h3: { fontSize: 16, fontWeight: 700, letterSpacing: '-0.2px', color: '#111827' },
  body: { fontSize: 14, fontWeight: 400, color: '#374151' },
  caption: { fontSize: 12, fontWeight: 500, color: '#6b7280' },
  small: { fontSize: 11, fontWeight: 400, color: '#9ca3af' },
  label: { fontSize: 12, fontWeight: 600, color: '#6b7280' },
};

export const SPACING = {
  section: 24,
  card: 22,
  cardSm: 16,
};