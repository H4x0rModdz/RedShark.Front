"use client";

import React from 'react';
import { CheckCircle, LucideIcon } from 'lucide-react';

interface Step {
  step: number;
  icon: LucideIcon;
  label: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  steps, 
  currentStep, 
  className = "w-full mb-12" 
}) => {
  return (
    <div className={className}>
      <div className="flex items-center w-full">
        {steps.map((stepData, index) => {
          const { step, icon: IconComponent, label } = stepData;
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-500 transform relative border-2
                    ${currentStep >= step
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-800 text-slate-400 border-slate-600'
                    }
                    ${isActive ? 'animate-pulse' : ''}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                  {isActive && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-30 animate-ping" />
                  )}
                </div>
                <p className={`
                  mt-3 text-xs font-medium transition-colors duration-300 whitespace-nowrap
                  ${currentStep >= step ? 'text-blue-400' : 'text-slate-500'}
                `}>
                  {label}
                </p>
              </div>

              {/* Progress Bar (only if not the last step) */}
              {!isLast && (
                <div className="flex-1 h-1 mx-4 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out shadow-sm shadow-blue-500/25 ${currentStep > step ? 'w-full' : 'w-0'}`}
                    style={{ 
                      transitionDelay: `${index * 300}ms` 
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};