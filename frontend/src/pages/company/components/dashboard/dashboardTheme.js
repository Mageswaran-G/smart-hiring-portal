export const C = {
  primary: '#1e3a5f',
  mid: '#1e40af',
  dark: '#152d4a',
  accent: '#3b82f6',
  light: '#eff6ff',
  border: '#bfdbfe',
  grad: 'linear-gradient(135deg, #0a1628 0%, #152d4a 30%, #1e3a5f 60%, #1e40af 100%)',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

export const cardStyle = {
  background: '#fff',
  borderRadius: 20,
  padding: 22,
  boxShadow: '0 1px 5px rgba(0,0,0,0.06)',
  border: `1px solid ${C.gray100}`,
};

export const largeCardStyle = {
  ...cardStyle,
  padding: 26,
};
