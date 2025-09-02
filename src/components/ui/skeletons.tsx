import React from 'react';

// Base skeleton component
const Skeleton = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={`animate-pulse bg-slate-700/50 rounded ${className}`}
    {...props}
  />
);

// Post skeleton for feed
export const PostSkeleton = () => (
  <div className="bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm shadow-lg rounded-xl p-6 mb-6">
    {/* Header */}
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    
    {/* Content */}
    <div className="space-y-2 mb-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    
    {/* Actions */}
    <div className="flex items-center space-x-6">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

// Chat item skeleton
export const ChatSkeleton = () => (
  <div className="flex items-center space-x-3 p-3 border-b border-slate-700/50">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

// Message skeleton  
export const MessageSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div className={`max-w-xs p-3 rounded-lg space-y-2 ${
          i % 2 === 0 ? 'bg-slate-700' : 'bg-blue-600'
        }`}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

// Feed loading skeleton (multiple posts)
export const FeedSkeleton = ({ count = 5 }: { count?: number }) => (
  <div>
    {[...Array(count)].map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
);

// Chat list loading skeleton
export const ChatListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div>
    {[...Array(count)].map((_, i) => (
      <ChatSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;