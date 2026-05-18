// ProgressRing
// Circular SVG progress ring
// Props: value (0-100), size, stroke (strokeWidth), color, bg, textColor, label

import React from 'react';

export default function ProgressRing({
  value     = 0,
  size      = 80,
  stroke    = 8,
  color     = '#ea580c',
  bg        = 'rgba(255,255,255,0.2)',
  textColor = '#ffffff',
  label     = null,
}) {
  const r      = (size - stroke) / 2;
  const circ   = 2 * Math.PI * r;
  const pct    = Math.min(100, Math.max(0, value));
  const offset = circ - (pct / 100) * circ;
  const fSize  = size * 0.21;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {/* SVG ring — rotated so it starts from top */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={bg} strokeWidth={stroke} />
        {/* Progress arc */}
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: fSize, fontWeight: 800, color: textColor, lineHeight: 1 }}>
          {value}%
        </span>
        {label && (
          <span style={{ fontSize: fSize * 0.6, color: textColor, opacity: 0.75, lineHeight: 1, marginTop: 2 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}