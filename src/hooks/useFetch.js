import { useState, useEffect } from "react";

/**
 * Custom hook to handle API data fetching with state tracking and race-condition prevention.
 * @param {string|null} url - The endpoint URL to fetch data from.
 * @returns {Object} { data, loading, error }
 */
export function useFetch(url) {
  // State for holding retrieved API response
  const [data, setData] = useState(null);

  // Track loading state; defaults to true if a valid URL is provided initially
  const [loading, setLoading] = useState(Boolean(url));

  // Track errors (network errors, 404/500 HTTP status, etc.)
  const [error, setError] = useState(null);

  useEffect(() => {
    // If no URL is provided, reset states and avoid running fetch
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    // AbortController cancels pending requests when component unmounts or URL changes
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch data (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setError(null);
      })
      .catch((err) => {
        // Ignore aborted requests to prevent state updates on unmounted components
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    // Cleanup: cancel fetch request if URL changes before response completes
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
