// Shared scoring utilities for AI dashboard components

// Clamp any percentage between 0-100
export const clampPercent = (value) =>
  Math.min(100, Math.max(0, value));

// Get severity color for progress bars
export const getBarColor = (progress) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 40) return 'bg-orange-500';
  return 'bg-red-400';
};

// Color map for score labels
export const SCORE_COLOR_MAP = {
  green:  { bg: 'bg-green-50',  ring: 'text-green-600',  badge: 'bg-green-100 text-green-700',  bar: 'bg-green-500'  },
  blue:   { bg: 'bg-blue-50',   ring: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-500'   },
  orange: { bg: 'bg-orange-50', ring: 'text-orange-600', badge: 'bg-orange-100 text-orange-700',bar: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',    ring: 'text-red-600',    badge: 'bg-red-100 text-red-700',      bar: 'bg-red-500'    },
};