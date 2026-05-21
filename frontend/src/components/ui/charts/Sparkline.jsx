const Sparkline = ({ data = [], color = '#7c3aed', width = 108, height = 38, className = '', style = {} }) => {
  const points = data.length ? data : [2,4,3,6,5,8,7,10];
  const max = Math.max(...points, 1);
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / max) * height;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} className={className}
      style={{ display:'block', ...style }}>
      <path d={path} fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export default Sparkline;
