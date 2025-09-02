import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface UseApiCacheOptions {
  cacheTime?: number; // Cache duration in milliseconds (default 5 minutes)
  staleTime?: number; // Time before data is considered stale (default 30 seconds)
  enabled?: boolean; // Whether to enable the query
}

const globalCache = new Map<string, CacheEntry<any>>();

export function useApiCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseApiCacheOptions = {}
) {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
    enabled = true,
  } = options;

  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    if (!enabled) return;

    const now = Date.now();
    const cached = globalCache.get(key);

    // Check if we have valid cached data
    if (cached && now < cached.expiry) {
      setData(cached.data);
      setError(null);
      hasLoadedRef.current = true;
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      
      if (mountedRef.current) {
        setData(result);
        hasLoadedRef.current = true;
        
        // Cache the result
        globalCache.set(key, {
          data: result,
          timestamp: now,
          expiry: now + cacheTime,
        });
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [key, enabled, fetchFn, cacheTime]);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadData();
    }
  }, [loadData]);

  const refetch = async () => {
    if (!enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn();
      
      if (mountedRef.current) {
        setData(result);
        setLoading(false);
        
        // Update cache
        const now = Date.now();
        globalCache.set(key, {
          data: result,
          timestamp: now,
          expiry: now + cacheTime,
        });
      }
      
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
        setLoading(false);
      }
      throw err;
    }
  };

  const invalidate = () => {
    globalCache.delete(key);
    fetchedRef.current = false;
  };

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
  };
}

// Utility function to clear all cache
export const clearAllCache = () => {
  globalCache.clear();
};

// Utility function to clear specific cache entries
export const clearCache = (keys: string[]) => {
  keys.forEach(key => globalCache.delete(key));
};