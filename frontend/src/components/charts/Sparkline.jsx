// Sparkline
// Mini line chart — shows trend data as a small SVG path
// Example: [2,3,4,5,6,9,12] renders a rising line

export default function Sparkline({ data = [], color = '#ea580c', width = 60, height = 26 }) {
  if (!data || data.length < 2) return null;

  const min  = Math.min(...data);
  const max  = Math.max(...data);
  const range = max - min || 1;

  // Convert data values to SVG x,y coordinates
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = points.join(' ');
  const lastPoint = points[points.length - 1].split(',');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* Dot at end */}
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r="2.5"
        fill={color}
      />
      {/* Gradient fill under line */}
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${height} ${polyline} ${width},${height}`}
        fill={`url(#sg-${color.replace('#','')})`}
        stroke="none"
      />
    </svg>
  );
}