// SkillChip.jsx — Reusable skill tag — Tailwind version

const typeClasses = {
  matched:    'bg-green-100 text-green-700',
  missing:    'bg-red-50 text-red-600',
  suggestion: 'bg-amber-50 text-amber-800',
};

export default function SkillChip({ label, type = 'matched' }) {
  const classes = typeClasses[type] || typeClasses.matched;
  return (
    <span className={`${classes} px-2.5 py-0.5 rounded-lg text-xs font-semibold`}>
      {label}
    </span>
  );
}