import { useCallback, useEffect, useState } from 'react';
import { fetchSavedResults } from '../lib/api';

export default function useSavedResults() {
  const [savedResults, setSavedResults] = useState([]);

  const refreshSavedResults = useCallback(async () => {
    try {
      const data = await fetchSavedResults();
      setSavedResults(data.results || []);
    } catch {
      // Result history is helpful but not required for generation.
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(refreshSavedResults, 0);
    return () => clearTimeout(timer);
  }, [refreshSavedResults]);

  return { savedResults, refreshSavedResults };
}
