// FilterTabs.jsx — Reusable filter tab bar
// Supports: string tabs, object tabs { value, label, count }

import { COLORS } from '../../theme/adminTheme';

export default function FilterTabs({ tabs = [], active, onChange }) {
  return (
    <div style={{
      display:'flex', gap:4,
      flexWrap:'wrap', rowGap:4,
      background:'rgba(0,0,0,0.04)',
      borderRadius:10, padding:4,
    }}>
      {tabs.map(tab => {
        const value = typeof tab === 'string' ? tab : tab.value;
        const label = typeof tab === 'string'
          ? tab.charAt(0).toUpperCase() + tab.slice(1)
          : tab.label;
        const count = typeof tab === 'object' ? tab.count : undefined;
        const isActive = active === value;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'6px 14px',
              borderRadius:8, fontSize:13,
              fontWeight: isActive ? 600 : 500,
              background: isActive ? COLORS.white : 'transparent',
              color: isActive ? COLORS.primary : COLORS.gray500,
              border:'none', cursor:'pointer',
              transition:'all 0.15s ease',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              whiteSpace:'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = COLORS.gray700; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = COLORS.gray500; }}
          >
            {label}
            {count !== undefined && (
              <span style={{
                background: isActive ? `${COLORS.primary}18` : 'rgba(0,0,0,0.08)',
                color: isActive ? COLORS.primary : COLORS.gray500,
                fontSize:11, fontWeight:700,
                padding:'1px 6px', borderRadius:6,
                minWidth:18, textAlign:'center',
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
