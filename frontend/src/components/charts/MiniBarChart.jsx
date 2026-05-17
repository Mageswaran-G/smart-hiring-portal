// MiniBarChart
// Small bar chart for weekly job views / application trends

export default function MiniBarChart({
  data   = [],   // [{ label:'M', value:5, dim:false }, ...]
  color  = '#16a34a',
  height = 60,
  width  = 280,
}) {
  if (!data.length) return null;

  const max     = Math.max(...data.map(d => d.value)) || 1;
  const barW    = Math.floor(width / data.length) - 4;
  const gap     = 4;

  return (
    <svg width={width} height={height + 18} viewBox={`0 0 ${width} ${height + 18}`}>
      {data.map((d, i) => {
        const barH  = (d.value / max) * height;
        const x     = i * (barW + gap);
        const y     = height - barH;
        const fill  = d.dim ? `${color}40` : color;

        return (
          <g key={i}>
            {/* Bar */}
            <rect
              x={x} y={y}
              width={barW} height={barH}
              rx={3}
              fill={fill}
            />
            {/* Label */}
            <text
              x={x + barW / 2}
              y={height + 14}
              textAnchor="middle"
              fontSize="9"
              fill={d.dim ? '#9ca3af' : '#6b7280'}
              fontFamily="Inter, sans-serif"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}