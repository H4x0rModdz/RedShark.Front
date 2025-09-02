"use client";

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProfileRedirect = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.userName) {
      router.replace(`/profile/${session.user.userName}`);
    } else if (session?.user?.name) {
      // Fallback to name if userName is not available
      const username = session.user.name.toLowerCase().replace(/\s+/g, '_');
      router.replace(`/profile/${username}`);
    } else {
      router.replace('/home');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium">Redirecionando...</p>
      </div>
    </div>
  );
};

export default ProfileRedirect;