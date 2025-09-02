import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileTabsProps {
  activeTab: 'posts' | 'badges' | 'photos';
  onTabChange: (tab: 'posts' | 'badges' | 'photos') => void;
  showPhotosTab?: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange, showPhotosTab = false }) => {
  const allTabs = [
    { key: 'posts' as const, label: 'Posts', icon: '📝' },
    { key: 'badges' as const, label: 'Distintivos', icon: '🏆' },
    { key: 'photos' as const, label: 'Fotos', icon: '📸' }
  ];
  
  const tabs = showPhotosTab ? allTabs : allTabs.filter(tab => tab.key !== 'photos');

  return (
    <Card className="mb-4 bg-slate-800/60 border-slate-700/60 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTabs;