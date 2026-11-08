import { useState, useEffect } from "react";

/**
 * Custom hook to synchronize React state with window.localStorage.
 * @param {string} key - Key used to identify data in localStorage.
 * @param {any} initialValue - Fallback value if no value exists in localStorage.
 * @returns {[any, Function]} [storedValue, setStoredValue]
 */
export function useLocalStorage(key, initialValue) {
  // Lazy initializer to read from localStorage only on initial render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(`Error reading key "${key}" from localStorage:`, err);
      return initialValue;
    }
  });

  // Keep localStorage synchronized whenever key or storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.error(`Error writing key "${key}" to localStorage:`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
