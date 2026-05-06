// ─────────────────────────────────────────────────────
// theme.js
// Purpose: Centralized color theme based on user role
// Instead of writing isCandidate ? orange : navy everywhere
// we use theme.button, theme.badge etc
// ─────────────────────────────────────────────────────

// Candidate theme — orange colors
export const candidateTheme = {
  // Buttons
  button:      'bg-orange-500 hover:bg-orange-600 text-white',
  buttonLight: 'border border-orange-400 text-orange-500 hover:bg-orange-50',
  
  // Avatar and borders  
  avatar:      'bg-orange-500',
  border:      'border-orange-500',
  
  // Badge
  badge:       'bg-orange-50 text-orange-500',
  
  // Focus rings on inputs
  focus:       'focus:border-orange-400 focus:ring-1 focus:ring-orange-100',
  
  // Text color
  text:        'text-orange-500',
  
  // Logo box
  logo:        'bg-orange-500',
};

// Company theme — navy colors
export const companyTheme = {
  // Buttons
  button:      'bg-blue-900 hover:bg-blue-800 text-white',
  buttonLight: 'border border-blue-900 text-blue-900 hover:bg-blue-50',
  
  // Avatar and borders
  avatar:      'bg-blue-900',
  border:      'border-blue-900',
  
  // Badge
  badge:       'bg-blue-50 text-blue-900',
  
  // Focus rings on inputs
  focus:       'focus:border-blue-800 focus:ring-1 focus:ring-blue-100',
  
  // Text color
  text:        'text-blue-900',
  
  // Logo box
  logo:        'bg-blue-900',
};

// getTheme — returns correct theme based on role
// Usage: const theme = getTheme(isCandidate)
// Then:  className={theme.button}
export const getTheme = (isCandidate) => {
  return isCandidate ? candidateTheme : companyTheme;
};