"use client";

import React, { useState, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

const MiniPlayer: React.FC = () => {
  const { currentTrack, isPlaying, pause } = useAudio();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!!currentTrack);
  }, [currentTrack]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-800/95 border border-slate-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
      <div className="flex items-center space-x-3 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm">🎵 Tocando preview</span>
        </div>
        
        <button
          onClick={pause}
          className="w-6 h-6 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center transition-colors"
          title="Pausar"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;