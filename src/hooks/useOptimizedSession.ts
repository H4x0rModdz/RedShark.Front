import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import type { Session } from 'next-auth';

export interface OptimizedSession extends Session {
  user: Session['user'] & {
    id: string;
    token: string;
    userName: string;
    biography?: string;
  };
}

export function useOptimizedSession() {
  const { data: session, status } = useSession();

  // Memoize session data to prevent unnecessary re-renders
  const memoizedSession = useMemo(() => {
    if (!session) return null;
    
    return session as OptimizedSession;
  }, [session?.user?.id, session?.user?.token]); // Only re-compute when essential fields change

  const isAuthenticated = useMemo(() => {
    return status === 'authenticated' && !!memoizedSession?.user?.token;
  }, [status, memoizedSession?.user?.token]);

  const isLoading = useMemo(() => {
    return status === 'loading';
  }, [status]);

  return {
    session: memoizedSession,
    status,
    isAuthenticated,
    isLoading,
  };
}