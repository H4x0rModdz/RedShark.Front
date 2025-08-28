"use client";

import { useSession, signOut } from 'next-auth/react';
import React from 'react';

const SessionDebug = () => {
  const { data: session, status, update } = useSession();

  if (process.env.NODE_ENV !== 'development') return null;

  const forceLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  const refreshSession = () => {
    update();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-yellow-400 font-bold">SESSION DEBUG</h3>
        <div className="space-x-1">
          <button 
            onClick={refreshSession}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Refresh
          </button>
          <button 
            onClick={forceLogout}
            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
          >
            Logout
          </button>
        </div>
      </div>
      <p><strong>Status:</strong> {status}</p>
      {session && (
        <div>
          <p><strong>Session exists:</strong> Yes</p>
          <p><strong>User object:</strong> {session.user ? 'Yes' : 'No'}</p>
          {session.user && (
            <div className="mt-2">
              <p><strong>Expected fields:</strong></p>
              <ul className="text-xs text-gray-300">
                <li>name: {session.user.name ? '✅' : '❌'}</li>
                <li>userName: {session.user.userName ? '✅' : '❌'}</li>
                <li>email: {session.user.email ? '✅' : '❌'}</li>
                <li>image: {session.user.image ? '✅' : '❌'}</li>
              </ul>
              <p className="mt-2"><strong>Raw user data:</strong></p>
              <pre className="text-xs bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap max-h-32 overflow-auto">
                {JSON.stringify(session.user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionDebug;