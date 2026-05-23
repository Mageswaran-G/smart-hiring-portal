import { COLORS } from '../../theme/adminTheme';

export default function FilterTabs({ tabs = [], active, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 4,
      flexWrap: "wrap", rowGap: 4,
      background: 'rgba(0,0,0,0.04)',
      borderRadius: 10,
      padding: 4,
    }}>
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
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              background: isActive ? COLORS.white : "transparent",
              color: isActive ? COLORS.primary : COLORS.gray500,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}