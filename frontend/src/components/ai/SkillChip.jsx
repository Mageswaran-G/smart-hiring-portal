// SkillChip.jsx — Reusable skill tag for matched/missing skills

export default function SkillChip({ label, type = 'matched' }) {
  const styles = {
    matched:    { background: '#dcfce7', color: '#15803d' },
    missing:    { background: '#fef2f2', color: '#dc2626' },
    suggestion: { background: '#fef3c7', color: '#92400e' },
  };

  const s = styles[type] || styles.matched;

  return (
    <span style={{
      background: s.background,
      color: s.color,
      padding: '3px 10px',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600
    }}>
      {label}
    </span>
  );
}