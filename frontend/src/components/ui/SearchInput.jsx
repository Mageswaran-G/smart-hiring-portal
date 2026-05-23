import { useState } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '../../theme/adminTheme';

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
      <Search
        size={15}
        style={{
          position: "absolute", left: 14,
          top: "50%", transform: "translateY(-50%)",
          color: focused ? COLORS.primary : COLORS.gray400,
          transition: "color 0.15s ease",
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          paddingLeft: 38, paddingRight: 14,
          paddingTop: 9, paddingBottom: 9,
          border: `1.5px solid ${focused ? COLORS.primary : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 10,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          color: COLORS.gray900,
          background: focused ? COLORS.white : '#fafafa',
          transition: "all 0.15s ease",
          boxShadow: focused ? `0 0 0 3px ${COLORS.primary}15` : '0 1px 3px rgba(0,0,0,0.04)',
        }}
      />
    </div>
  );
}