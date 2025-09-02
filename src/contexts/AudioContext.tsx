"use client";

import React, { createContext, useContext, useState, useRef } from 'react';

interface AudioContextType {
  currentTrack: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (url: string, trackId: string) => void;
  pause: () => void;
  stop: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    }, 100); // Update every 100ms for smooth progress
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const play = (url: string, trackId: string) => {
    // If same track is playing, just pause/play
    if (currentTrack === trackId && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        stopProgressTracking();
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        startProgressTracking();
      }
      return;
    }

    // Stop current track and play new one
    stop();
    
    if (!url) {
      console.warn('No preview URL available for this track');
      return;
    }

    audioRef.current = new Audio(url);
    audioRef.current.volume = 0.7;
    
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current?.duration || 0);
      setCurrentTime(0);
    });
    
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTrack(null);
      setCurrentTime(0);
      setDuration(0);
      stopProgressTracking();
    });
    
    audioRef.current.addEventListener('error', (e) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
      setCurrentTrack(null);
      setCurrentTime(0);
      setDuration(0);
      stopProgressTracking();
    });

    audioRef.current.play().then(() => {
      setCurrentTrack(trackId);
      setIsPlaying(true);
      startProgressTracking();
    }).catch((error) => {
      console.error('Error playing audio:', error);
    });
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopProgressTracking();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setDuration(0);
    stopProgressTracking();
  };

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      play,
      pause,
      stop
    }}>
      {children}
    </AudioContext.Provider>
  );
};