import { COLORS } from '../../theme/adminTheme';
const base = { background: COLORS.gray100 };

export default function TableLoader({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          padding: "14px 20px",
          borderBottom: i < rows - 1 ? `1px solid ${COLORS.gray100}` : "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          {/* Avatar shimmer */}
          <div className="shimmer" style={{ ...base, width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />


          {/* Lines shimmer */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="shimmer" style={{ ...base, height: 12, width: "40%", borderRadius: 6 }} />
            <div className="shimmer" style={{ ...base, height: 10, width: "25%", borderRadius: 6 }} />
          </div>

          {/* Badge shimmer */}
          <div className="shimmer" style={{ ...base, width: 60, height: 22, borderRadius: 20 }} />

          {/* Button shimmer */}
          <div className="shimmer" style={{ ...base, width: 70, height: 30, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}