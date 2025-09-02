import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MaritalStatus } from '@/types/IUser';
import { UserProfile } from '@/types/IUserProfile';

interface ProfileAboutProps {
  profile: UserProfile;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ profile }) => {

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatBirthDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatMaritalStatus = (status: MaritalStatus) => {
    const statusMap = {
      [MaritalStatus.Single]: 'Solteiro(a)',
      [MaritalStatus.Married]: 'Casado(a)',
      [MaritalStatus.InARelationship]: 'Em um relacionamento',
      [MaritalStatus.Divorced]: 'Divorciado(a)',
      [MaritalStatus.Widowed]: 'Viúvo(a)',
      [MaritalStatus.Complicated]: 'É complicado'
    };
    return statusMap[status] || status;
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Sobre</h3>
        
        {profile.bio && (
          <p className="text-slate-300 mb-4 leading-relaxed">{profile.bio}</p>
        )}

        <div className="space-y-3">
          {profile.location && (
            <div className="flex items-center text-slate-300">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{profile.location}</span>
            </div>
          )}

          {profile.profession && (
            <div className="flex items-center text-slate-300">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
              </svg>
              <span>{profile.profession}</span>
            </div>
          )}

          {profile.website && (
            <div className="flex items-center text-slate-300">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-400 hover:text-blue-300 hover:underline">
                {profile.website.replace('https://', '')}
              </a>
            </div>
          )}

          {profile.birthDate && (
            <div className="flex items-center text-slate-300">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Nascido em {formatBirthDate(profile.birthDate)}</span>
            </div>
          )}

          {profile.maritalStatus && (
            <div className="flex items-center text-slate-300">
              <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{formatMaritalStatus(profile.maritalStatus)}</span>
            </div>
          )}


          <div className="flex items-center text-slate-300 pt-2 border-t border-slate-700">
            <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Entrou em {formatJoinDate(profile.joinedDate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAbout;