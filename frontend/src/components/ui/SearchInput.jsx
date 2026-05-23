import { Search } from 'lucide-react';
import { COLORS } from '../../theme/adminTheme';

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
      <Search
        size={16}
        style={{
          position: "absolute", left: 12,
          top: "50%", transform: "translateY(-50%)",
          color: COLORS.gray400,
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          paddingLeft: 36, paddingRight: 12,
          paddingTop: 8, paddingBottom: 8,
          border: `1px solid ${COLORS.gray200}`,
          borderRadius: 8,
          fontSize: 14,
          outline: "none",
          boxSizing: "border-box",
          color: COLORS.gray900,
        }}
      />
    </div>
  );
}