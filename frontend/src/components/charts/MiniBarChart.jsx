//MiniBarChart
// Small SVG bar chart for analytics cards
// Props: data (number[]), color, w, h, gap (space between bars)

import React from 'react';

export default function MiniBarChart({
  data  = [],
  color = '#1e3a5f',
  w     = 120,
  h     = 48,
  gap   = 3,
}) {
  if (!data || data.length === 0) return null;

  const max      = Math.max(...data, 1);
  const barWidth = (w - (data.length - 1) * gap) / data.length;

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {data.map((val, i) => {
        const barH   = Math.max(3, (val / max) * (h - 4));
        const x      = i * (barWidth + gap);
        const y      = h - barH;
        const isLast = i === data.length - 1;
        return (
          <rect key={i}
            x={x} y={y} width={barWidth} height={barH}
            rx={3} ry={3}
            fill={color}
            opacity={isLast ? 1 : 0.3 + (val / max) * 0.5}
          />
        );
      })}
    </svg>
  );
}