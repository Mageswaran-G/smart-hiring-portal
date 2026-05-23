import { COLORS } from '../../theme/adminTheme';

export default function FilterTabs({ tabs = [], active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map(tab => {
        const value = typeof tab === "string" ? tab : tab.value;
        const label = typeof tab === "string"
          ? tab.charAt(0).toUpperCase() + tab.slice(1)
          : tab.label;
        const isActive = active === value;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              background: isActive ? COLORS.primary : COLORS.white,
              color: isActive ? COLORS.white : COLORS.gray600,
              border: `1px solid ${isActive ? COLORS.primary : COLORS.gray200}`,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}