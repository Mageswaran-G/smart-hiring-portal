import { C } from './dashboardTheme';

export default function MiniBarChart({ data = [], color = C.accent, w = 100, h = 44 }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data, 1);
  const gap = 3;
  const bw = (w - (data.length - 1) * gap) / data.length;

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bh = Math.max(3, (v / max) * (h - 4));
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={h - bh}
            width={bw}
            height={bh}
            rx={3}
            fill={color}
            opacity={i === data.length - 1 ? 1 : 0.3 + (v / max) * 0.5}
          />
        );
      })}
    </svg>
  );
}
