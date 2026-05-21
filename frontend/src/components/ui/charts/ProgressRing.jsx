const ProgressRing = ({ value = 0, size = 76, stroke = 7, color = '#a78bfa', label = 'hired', className = '', style = {} }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className={className} style={style}>
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
export default ProgressRing;
