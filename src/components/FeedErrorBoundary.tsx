"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ErrorBoundary from './ErrorBoundary';

interface FeedErrorBoundaryProps {
  children: React.ReactNode;
}

const FeedErrorFallback = () => (
  <Card className="bg-slate-800/30 border-slate-700/30">
    <CardContent className="p-8 text-center">
      <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-white text-lg font-medium mb-2">Erro ao carregar o feed</h3>
      <p className="text-slate-400 mb-4">
        Não foi possível carregar os posts. Por favor, recarregue a página.
      </p>
      <Button 
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        Recarregar feed
      </Button>
    </CardContent>
  </Card>
);

const FeedErrorBoundary: React.FC<FeedErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary fallback={<FeedErrorFallback />}>
      {children}
    </ErrorBoundary>
  );
};

export default FeedErrorBoundary;