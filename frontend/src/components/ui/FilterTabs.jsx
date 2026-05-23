
// Reusable filter tab row
// Usage: <FilterTabs tabs={["all","active","closed"]} active={filter} onChange={setFilter} />

import { COLORS } from '../../theme/adminTheme';

export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: active === tab ? 600 : 400,
            background: active === tab ? COLORS.primary : "transparent",
            color: active === tab ? COLORS.white : COLORS.gray500,
            border: active === tab ? "none" : `1px solid ${COLORS.gray200}`,
            cursor: "pointer",
            textTransform: "capitalize",
            transition: "all 0.15s ease",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}