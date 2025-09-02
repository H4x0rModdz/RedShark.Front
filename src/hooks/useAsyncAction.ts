import { useState, useCallback } from 'react';

interface UseAsyncActionOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export function useAsyncAction<T extends any[], R>(
  asyncFunction: (...args: T) => Promise<R>,
  options: UseAsyncActionOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(async (...args: T): Promise<R | null> => {
    if (isLoading) {
      console.log('Action already in progress, preventing duplicate request');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction, isLoading, options]);

  return {
    execute,
    isLoading,
    error,
    reset: () => setError(null)
  };
}