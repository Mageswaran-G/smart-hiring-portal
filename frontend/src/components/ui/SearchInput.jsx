// SearchInput.jsx — Reusable search input with debounce
// debounce: waits 300ms after user stops typing before calling onChange

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { COLORS } from '../../theme/adminTheme';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  showClear = true,
}) {
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');
  const timerRef = useRef(null);

  // Sync if parent value changes externally
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Wait debounceMs then call parent onChange
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div style={{ position:'relative', flex:1, minWidth:220 }}>
      {/* Search icon */}
      <Search
        size={15}
        style={{
          position:'absolute', left:14,
          top:'50%', transform:'translateY(-50%)',
          color: focused ? COLORS.primary : COLORS.gray400,
          transition:'color 0.15s ease',
          pointerEvents:'none',
        }}
      />

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:'100%',
          paddingLeft:38,
          paddingRight: showClear && localValue ? 36 : 14,
          paddingTop:9, paddingBottom:9,
          border:`1.5px solid ${focused ? COLORS.primary : 'rgba(0,0,0,0.08)'}`,
          borderRadius:10,
          fontSize:14,
          outline:'none',
          boxSizing:'border-box',
          color:COLORS.gray900,
          background: focused ? COLORS.white : '#fafafa',
          transition:'all 0.15s ease',
          boxShadow: focused ? `0 0 0 3px ${COLORS.primary}15` : '0 1px 3px rgba(0,0,0,0.04)',
        }}
      />

      {/* Clear button */}
      {showClear && localValue && (
        <button
          onClick={handleClear}
          style={{
            position:'absolute', right:10,
            top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none',
            cursor:'pointer', color:COLORS.gray400,
            display:'flex', alignItems:'center',
            padding:2, borderRadius:4,
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
