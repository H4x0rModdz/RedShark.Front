"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  show?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  disabled = false,
  className = "absolute top-4 left-4",
  show = true
}) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${className}
        p-2 rounded-full bg-slate-600/70 hover:bg-slate-500/80 text-slate-300 hover:text-slate-100 
        transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-slate-500/30 
        hover:border-slate-400/50 z-30 shadow-lg
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
};