const MiniBarChart = ({ data = [], color = '#7c3aed', width = 180, height = 40, className = '', style = {} }) => {
  const max = Math.max(...data, 1);
  const barW = Math.max(4, Math.floor(width / data.length) - 2);
  return (
    <svg width={width} height={height} className={className}
      style={{ display:'block', ...style }}>
      {data.map((val, i) => {
        const barH = Math.max(3, Math.round((val / max) * height));
        return (
          <rect key={i} x={i * (barW + 2)} y={height - barH}
            width={barW} height={barH} rx={2}
            fill={val === max ? color : color + '55'} />
        );
      })}
    </svg>
  );
};
export default MiniBarChart;
