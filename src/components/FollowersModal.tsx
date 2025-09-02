"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FollowerData } from '@/types/IFollowerData';

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  followers: FollowerData[];
  following: FollowerData[];
  type: 'followers' | 'following';
  onFollowToggle?: (username: string, currentlyFollowing: boolean) => void;
}

const FollowersModal: React.FC<FollowersModalProps> = ({
  isOpen,
  onClose,
  followers,
  following,
  type,
  onFollowToggle
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(type);
  
  const currentList = activeTab === 'followers' ? followers : following;

  const handleFollowToggle = (username: string, currentlyFollowing: boolean) => {
    if (onFollowToggle) {
      onFollowToggle(username, currentlyFollowing);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="bg-slate-900 border-slate-700 w-full max-w-md max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('followers')}
                  className={`pb-2 px-1 font-medium transition-colors ${
                    activeTab === 'followers' 
                      ? 'text-white border-b-2 border-blue-500' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {followers.length} Seguidores
                </button>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`pb-2 px-1 font-medium transition-colors ${
                    activeTab === 'following' 
                      ? 'text-white border-b-2 border-blue-500' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {following.length} Seguindo
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-0 overflow-y-auto max-h-[60vh]">
            {currentList.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p>
                  {activeTab === 'followers' 
                    ? 'Nenhum seguidor ainda' 
                    : 'Não está seguindo ninguém ainda'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {currentList.map((user) => (
                  <div key={user.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profileImage || 'https://github.com/shadcn.png'}
                          alt={user.displayName}
                          className="w-10 h-10 rounded-full ring-2 ring-slate-600"
                        />
                        <div>
                          <p className="font-medium text-white">{user.displayName}</p>
                          <p 
                            className="text-sm text-slate-400 cursor-pointer hover:text-blue-400 transition-colors"
                            onClick={() => window.location.href = `/profile/${user.username}`}
                          >
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleFollowToggle(user.username, user.amIFollowingThisPerson)}
                        variant={user.amIFollowingThisPerson ? "outline" : "default"}
                        size="sm"
                        className={`min-w-[80px] ${
                          user.amIFollowingThisPerson 
                            ? 'border-slate-600 text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        }`}
                      >
                        {user.amIFollowingThisPerson ? 'Seguindo' : 'Seguir'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FollowersModal;