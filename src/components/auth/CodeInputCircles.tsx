"use client";

import React from 'react';

interface CodeInputCirclesProps {
  code: string;
  onCodeChange: (code: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export const CodeInputCircles: React.FC<CodeInputCirclesProps> = ({
  code,
  onCodeChange,
  length = 6,
  disabled = false,
  autoFocus = false,
  className = "flex justify-center gap-4 mb-6"
}) => {
  const codeArray = code.split('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    const cleanedValue = value.replace(/\D/g, '').slice(0, length);
    onCodeChange(cleanedValue);
  };

  const focusInput = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      <div className="relative">
        <div className={className} onClick={focusInput}>
          {Array.from({ length }, (_, index) => {
            const hasValue = Boolean(codeArray[index]);
            const isActive = index === codeArray.length && codeArray.length < length;
            
            return (
              <div
                key={index}
                className={`
                  w-12 h-12 rounded-full border-2 flex items-center justify-center
                  transition-all duration-300 transform cursor-pointer
                  ${hasValue 
                    ? 'border-blue-400 bg-blue-500/20 scale-110 shadow-lg shadow-blue-500/25' 
                    : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  }
                  ${isActive ? 'animate-pulse border-blue-400' : ''}
                  ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
                onClick={focusInput}
              >
                {hasValue && (
                  <span className="text-white text-lg font-bold animate-fadeIn">
                    {codeArray[index]}
                  </span>
                )}
                {!hasValue && isActive && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                )}
              </div>
            );
          })}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          className="sr-only"
          disabled={disabled}
          maxLength={length}
          autoFocus={autoFocus}
          placeholder={Array(length).fill('0').join('')}
        />
      </div>
    </>
  );
};