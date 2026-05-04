'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useApi — Generic data fetching hook with loading/error states + refetch.
 *
 * @param {() => Promise<any>} fetcher  Async function that returns the data.
 * @param {Array} deps                  Dependencies that re-trigger the fetch.
 * @param {{ enabled?: boolean, initialData?: any }} options
 *
 * @returns {{ data, loading, error, refetch, setData }}
 */
export function useApi(fetcher, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, loading, error, refetch: run, setData };
}

/**
 * useMutation — Hook for write operations (create/update/delete).
 *
 * @param {(args: any) => Promise<any>} mutator
 * @returns {{ mutate, loading, error, reset }}
 */
export function useMutation(mutator) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (args) => {
      setLoading(true);
      setError(null);
      try {
        return await mutator(args);
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutator],
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
}
