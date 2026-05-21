// Shared chart components — import from here, not from individual files

// Sparkline — small line chart
export const Sparkline = ({ data = [], color = '#7c3aed', w = 108, h = 38, id = 's' }) => {
  const points = data.length ? data : [2,4,3,6,5,8,7,10];
  const max = Math.max(...points, 1);
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / max) * h;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ display:'block' }}>
      <path d={path} fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// MiniBarChart — small bar chart
export const MiniBarChart = ({ data = [], color = '#7c3aed', w = 180, h = 40 }) => {
  const max = Math.max(...data, 1);
  const barW = Math.max(4, Math.floor(w / data.length) - 2);
  return (
    <svg width={w} height={h} style={{ display:'block' }}>
      {data.map((val, i) => {
        const barH = Math.max(3, Math.round((val / max) * h));
        return (
          <rect key={i} x={i * (barW + 2)} y={h - barH}
            width={barW} height={barH} rx={2}
            fill={val === max ? color : color + '55'} />
        );
      })}
    </svg>
  );
};

// ProgressRing — circular progress chart
export const ProgressRing = ({ value = 0, size = 76, stroke = 7, color = '#a78bfa', label = 'hired' }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 + 5} textAnchor="middle"
        fill="#fff" fontSize={13} fontWeight={700}>{value}%</text>
      <text x={size/2} y={size/2 + 18} textAnchor="middle"
        fill="rgba(255,255,255,0.7)" fontSize={9}>{label}</text>
    </svg>
  );
};
