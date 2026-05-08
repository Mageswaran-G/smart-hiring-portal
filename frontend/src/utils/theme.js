// Centralized theme — all role-based colors in one place
// Use this everywhere instead of isCandidate ? orange : navy

export const candidateTheme = {
  primary:     '#E65C00',
  button:      'bg-orange-500 hover:bg-orange-600',
  buttonLight: 'border-orange-400 text-orange-500 hover:bg-orange-50',
  badge:       'bg-orange-50 text-orange-500',
  avatar:      'bg-orange-500',
  border:      'border-orange-500',
  logo:        'bg-orange-500',
  focus:       'focus:border-orange-400 focus:shadow-orange-100',
};

export const companyTheme = {
  primary:     '#1D3557',
  button:      'bg-blue-900 hover:bg-blue-800',
  buttonLight: 'border-blue-900 text-blue-900 hover:bg-blue-50',
  badge:       'bg-blue-50 text-blue-900',
  avatar:      'bg-blue-900',
  border:      'border-blue-900',
  logo:        'bg-blue-900',
  focus:       'focus:border-blue-800 focus:shadow-blue-100',
};

// Returns correct theme based on role
export function getTheme(isCandidate) {
  return isCandidate ? candidateTheme : companyTheme;
}