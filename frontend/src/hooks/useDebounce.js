// useDebounce.js
// Simple hook — waits X milliseconds before returning new value
// Example: user types "React" fast → waits 400ms → returns "React"

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {

  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);  // update AFTER delay
    }, delay);

    // If value changes again BEFORE delay — cancel the old timer
    return () => clearTimeout(timer);

  }, [value, delay]);

  return debouncedValue;
}