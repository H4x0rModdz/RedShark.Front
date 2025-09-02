'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface OptimizedSessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function OptimizedSessionProvider({
  children,
  session,
}: OptimizedSessionProviderProps) {
  return (
    <SessionProvider
      session={session}
      // Reduce session polling frequency
      refetchInterval={5 * 60} // 5 minutes
      refetchOnWindowFocus={false} // Don't refetch when window regains focus
      refetchWhenOffline={false} // Don't refetch when coming back online
    >
      {children}
    </SessionProvider>
  );
}