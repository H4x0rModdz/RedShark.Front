"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LandingNavbarProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  showProgress?: {
    current: number;
    total: number;
  };
}

export default function LandingNavbar({ leftContent, rightContent, showProgress }: LandingNavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {leftContent || (
              <Link href="/" className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 group-hover:border-blue-500/50 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.div>
                <span className="text-slate-300 group-hover:text-white transition-colors">Voltar</span>
              </Link>
            )}
            
            {/* Progress indicator */}
            {showProgress && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(showProgress.current / showProgress.total) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {showProgress.current}/{showProgress.total}
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Right Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            {/* Custom right content */}
            {rightContent}
            
            {/* Logo and Brand - Same as Home */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-lg">RS</span>
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-blue-400/20 rounded-xl"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Red Shark
                </h1>
                <p className="text-xs text-slate-400">Conecte-se ao mundo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}