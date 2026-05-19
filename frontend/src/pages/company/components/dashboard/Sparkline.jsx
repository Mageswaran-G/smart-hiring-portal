import { C } from './dashboardTheme';

export default function Sparkline({ data = [], color = C.accent, w = 100, h = 38, id = 'co' }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => ({
    x: +((i / (data.length - 1)) * w).toFixed(2),
    y: +((h - 4) - ((v - min) / range) * (h - 8)).toFixed(2),
  }));
  const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  const gId = `sg-comp-${id}`;

  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
}
