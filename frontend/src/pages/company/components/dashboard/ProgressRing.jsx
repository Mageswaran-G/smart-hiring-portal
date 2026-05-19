import { C } from './dashboardTheme';

export default function ProgressRing({
  value = 0,
  size = 80,
  stroke = 8,
  color = C.accent,
  bg = 'rgba(255,255,255,0.18)',
  textColor = '#fff',
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.21, fontWeight: 800, color: textColor, lineHeight: 1 }}>{value}%</span>
        <span style={{ fontSize: size * 0.13, color: textColor, opacity: 0.7, lineHeight: 1, marginTop: 1 }}>hired</span>
      </div>
    </div>
  );
}
