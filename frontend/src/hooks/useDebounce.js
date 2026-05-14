// useDebounce.js
// Waits for user to stop typing before returning the value
// delay = how many milliseconds to wait

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer when value changes
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timer if value changes again before delay
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}