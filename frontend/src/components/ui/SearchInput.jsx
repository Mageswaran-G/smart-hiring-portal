import { useState } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '../../theme/adminTheme';

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
      <Search
        size={16}
        style={{
          position: "absolute", left: 12,
          top: "50%", transform: "translateY(-50%)",
          color: focused ? COLORS.primary : COLORS.gray400,
          transition: "color 0.15s",
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
          paddingLeft: 36, paddingRight: 12,
          paddingTop: 8, paddingBottom: 8,
          border: `1px solid ${focused ? COLORS.primary : COLORS.gray200}`,
          borderRadius: 8,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          color: COLORS.gray900,
          transition: "border-color 0.15s",
          boxShadow: focused ? `0 0 0 3px ${COLORS.primary}20` : "none",
        }}
      />
    </div>
  );
}