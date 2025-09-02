import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectIfNotAuthenticated?: boolean;
}

export const useAuthRedirect = ({
  redirectTo = '/home',
  redirectIfAuthenticated = false,
  redirectIfNotAuthenticated = false,
}: UseAuthRedirectOptions = {}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    const isAuthenticated = !!session?.user;

    if (redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectTo);
    } else if (redirectIfNotAuthenticated && !isAuthenticated) {
      router.push('/login');
    }
  }, [session, status, router, redirectTo, redirectIfAuthenticated, redirectIfNotAuthenticated]);

  return {
    session,
    status,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading'
  };
};