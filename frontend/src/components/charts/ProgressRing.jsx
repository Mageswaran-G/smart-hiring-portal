// ProgressRing
// Circular progress indicator using SVG
// Shows profile completion percentage

export default function ProgressRing({
  value  = 0,
  size   = 86,
  stroke = 8,
  color  = '#ea580c',
  track  = '#f3f4f6',
}) {
  const radius      = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled      = (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}
    >
      {/* Track circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={track}
        strokeWidth={stroke}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${filled} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
}