import { COLORS } from '../../theme/adminTheme';

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
          <div
            className="shimmer"
            style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: COLORS.gray100,
              flexShrink: 0,
            }}
          />

          {/* Lines shimmer */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              className="shimmer"
              style={{
                height: 12, width: "40%",
                background: COLORS.gray100,
                borderRadius: 6,
              }}
            />
            <div
              className="shimmer"
              style={{
                height: 10, width: "25%",
                background: COLORS.gray100,
                borderRadius: 6,
              }}
            />
          </div>

          {/* Badge shimmer */}
          <div
            className="shimmer"
            style={{
              width: 60, height: 22,
              background: COLORS.gray100,
              borderRadius: 20,
            }}
          />

          {/* Button shimmer */}
          <div
            className="shimmer"
            style={{
              width: 70, height: 30,
              background: COLORS.gray100,
              borderRadius: 8,
            }}
          />
        </div>
      ))}
    </div>
  );
}