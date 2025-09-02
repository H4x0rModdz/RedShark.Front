import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserBadge } from '@/types/IUserBadge';

interface ProfileBadgesProps {
  userBadges: UserBadge[];
  isMobileView?: boolean;
}

const ProfileBadges: React.FC<ProfileBadgesProps> = ({ userBadges, isMobileView = false }) => {
  if (isMobileView) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Distintivos</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {userBadges.map((badge) => (
              <div key={badge.id} className="flex items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors">
                <div className={`w-16 h-16 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center shadow-lg mr-4`}>
                  <img 
                    src={badge.iconUrl} 
                    alt={badge.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{badge.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      badge.rarity === 'Legendario' ? 'bg-purple-500/20 text-purple-300' :
                      badge.rarity === 'Epico' ? 'bg-green-500/20 text-green-300' :
                      badge.rarity === 'Raro' ? 'bg-blue-500/20 text-blue-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{badge.description}</p>
                  <p className="text-slate-500 text-xs mt-1">Conquistado em {new Date(badge.earnedDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userBadges.map((badge) => (
          <Card key={badge.id} className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 bg-gradient-to-r ${badge.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <img 
                    src={badge.iconUrl} 
                    alt={badge.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-semibold text-white truncate">{badge.name}</h4>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      badge.rarity === 'Legendario' ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30' :
                      badge.rarity === 'Epico' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                      badge.rarity === 'Raro' ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' :
                      'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                    }`}>
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{badge.description}</p>
                  <div className="flex items-center text-slate-500 text-xs">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Conquistado em {new Date(badge.earnedDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Card */}
      <Card className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            Estatisticas de Distintivos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{userBadges.length}</div>
              <div className="text-sm text-slate-400">Total</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">{userBadges.filter(b => b.rarity === 'Legendario').length}</div>
              <div className="text-sm text-slate-400">Legendarios</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">{userBadges.filter(b => b.rarity === 'Epico').length}</div>
              <div className="text-sm text-slate-400">Epicos</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{userBadges.filter(b => b.rarity === 'Raro').length}</div>
              <div className="text-sm text-slate-400">Raros</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBadges;