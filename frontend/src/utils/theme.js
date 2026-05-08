// Theme system — driven by role string, not boolean
// Supports candidate, company, admin
// Usage: const theme = getTheme(user.role)

const themes = {
  candidate: {
    primary:     '#E65C00',
    button:      'bg-orange-500 hover:bg-orange-600',
    buttonLight: 'border-orange-400 text-orange-500 hover:bg-orange-50',
    badge:       'bg-orange-50 text-orange-500',
    avatar:      'bg-orange-500',
    border:      'border-orange-500',
    logo:        'bg-orange-500',
    focus:       'focus:border-orange-400',
  },
  company: {
    primary:     '#1D3557',
    button:      'bg-blue-900 hover:bg-blue-800',
    buttonLight: 'border-blue-900 text-blue-900 hover:bg-blue-50',
    badge:       'bg-blue-50 text-blue-900',
    avatar:      'bg-blue-900',
    border:      'border-blue-900',
    logo:        'bg-blue-900',
    focus:       'focus:border-blue-800',
  },
  admin: {
    primary:     '#7C3AED',
    button:      'bg-purple-700 hover:bg-purple-800',
    buttonLight: 'border-purple-700 text-purple-700 hover:bg-purple-50',
    badge:       'bg-purple-50 text-purple-700',
    avatar:      'bg-purple-700',
    border:      'border-purple-700',
    logo:        'bg-purple-700',
    focus:       'focus:border-purple-600',
  },
};

// Pass user.role directly — 'candidate', 'company', or 'admin'
// Falls back to candidate theme if role is unknown
export function getTheme(role) {
  return themes[role] || themes.candidate;
}