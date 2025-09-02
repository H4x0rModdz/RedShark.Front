import { useState, useEffect, useRef } from 'react';

const cache = new Map<string, { data: any; timestamp: number }>();

export function useSimpleCache<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  cacheTimeMs: number = 5 * 60 * 1000 // 5 minutes default
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!cacheKey) return;
    
    // Commented out to reduce log noise
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('useSimpleCache effect running for key:', cacheKey);
    // }
    
    const loadData = async () => {
      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        const now = Date.now();
        
        if (cached && (now - cached.timestamp) < cacheTimeMs) {
          // Cached data available - using silently
          setData(cached.data);
          return;
        }

        // Fetch new data silently
        setLoading(true);
        setError(null);
        
        const result = await fetchFunction();
        
        // Update cache
        cache.set(cacheKey, { data: result, timestamp: now });
        
        setData(result);
        setLoading(false);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('useSimpleCache error for key:', cacheKey, err);
        }
        setError(err as Error);
        setLoading(false);
      }
    };

    loadData();
  }, [cacheKey, fetchFunction, cacheTimeMs]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      
      if (isMountedRef.current) {
        setData(result);
        // Update cache
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return { data, loading, error, refetch };
}