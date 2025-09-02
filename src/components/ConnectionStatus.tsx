"use client";

import React, { useState, useEffect } from 'react';

interface ConnectionStatusProps {
  isRealTime: boolean;
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isRealTime, isConnected }) => {
  const [showStatus, setShowStatus] = useState(false);
  const [hasShownInitially, setHasShownInitially] = useState(false);

  useEffect(() => {
    // Only show status after initial load and when there's an actual change
    if (!hasShownInitially) {
      setHasShownInitially(true);
      return; // Don't show notification on first load
    }

    // Show status for a few seconds only when connection actually changes
    setShowStatus(true);
    const timer = setTimeout(() => setShowStatus(false), 3000); // Reduced to 3 seconds
    return () => clearTimeout(timer);
  }, [isRealTime, isConnected]);

  if (!showStatus) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-4 py-2 rounded-lg shadow-lg border transition-all duration-300 ${
        isRealTime && isConnected
          ? 'bg-green-900/90 border-green-700 text-green-100'
          : 'bg-yellow-900/90 border-yellow-700 text-yellow-100'
      }`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isRealTime && isConnected ? 'bg-green-400' : 'bg-yellow-400'
          }`} />
          <span className="text-sm font-medium">
            {isRealTime && isConnected 
              ? 'Notificações em tempo real ativas'
              : 'Usando modo polling para notificações'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;