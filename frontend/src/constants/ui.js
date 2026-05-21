// Design tokens — single source of truth for all UI values
// Use these instead of hardcoding values in every component

export const UI = {
  radius: {
    sm: '10px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  shadow: {
    card: '0 1px 5px rgba(0,0,0,0.06)',
    elevated: '0 4px 16px rgba(0,0,0,0.10)',
    purple: '0 6px 28px rgba(124,58,237,0.3)',
  },
  border: {
    light: '1px solid #f3f4f6',
    purple: '1px solid #ddd6fe',
    gray: '1px solid #e5e7eb',
  },
  spacing: {
    section: 24,
    card: 22,
    cardSm: 16,
  },
  colors: {
    primary: '#7c3aed',
    dark: '#5b21b6',
    accent: '#a78bfa',
    light: '#f5f3ff',
    border: '#ddd6fe',
    gray900: '#111827',
    gray700: '#374151',
    gray500: '#6b7280',
    gray400: '#9ca3af',
    white: '#ffffff',
  },
};
