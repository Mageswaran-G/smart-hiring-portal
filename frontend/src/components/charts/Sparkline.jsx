// Sparkline
// Mini area + line chart using pure SVG
// Props: data (number[]), color, w (width), h (height), id (unique string for gradient)

import React, { useMemo } from 'react';

export default function Sparkline({ data = [], color = '#ea580c', w = 100, h = 40, id = 'sp' }) {
  const paths = useMemo(() => {
    if (!data || data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const pad = 4;

    const pts = data.map((v, i) => ({
      x: parseFloat(((i / (data.length - 1)) * w).toFixed(2)),
      y: parseFloat(((h - pad) - ((v - min) / range) * (h - pad * 2)).toFixed(2)),
    }));

    const line = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;
    const last = pts[pts.length - 1];

    return { line, area, last };
  }, [data, w, h]);

  if (!paths) return null;

  const gradId = `sg-${id}`;

  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={paths.area} fill={`url(#${gradId})`} />
      <path d={paths.line} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={paths.last.x} cy={paths.last.y} r="2.5" fill={color} />
    </svg>
  );
}