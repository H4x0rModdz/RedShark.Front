import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/ui/user-avatar';
import UserService from '@/services/UserService';
import { UserProfile } from '@/types/IUserProfile';

interface ProfileHeaderProps {
  profile: UserProfile;
  isFollowing: boolean;
  onFollow: () => void;
  onEditProfile: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  musicPlayer?: React.ReactNode;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isFollowing,
  onFollow,
  onEditProfile,
  onFollowersClick,
  onFollowingClick,
  musicPlayer
}) => {
  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleProfileImageClick = () => {
    profileImageRef.current?.click();
  };

  const handleCoverImageClick = () => {
    coverImageRef.current?.click();
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingProfile(true);
    try {
      await UserService.updateProfileImage(profile.id, file);
      // Reload page to show updated image
      window.location.reload();
    } catch (error) {
      console.error('Erro ao fazer upload da foto de perfil:', error);
      alert('Erro ao fazer upload da foto de perfil');
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const handleCoverImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      await UserService.updateCoverImage(profile.id, file);
      // Reload page to show updated image
      window.location.reload();
    } catch (error) {
      console.error('Erro ao fazer upload da foto de capa:', error);
      alert('Erro ao fazer upload da foto de capa');
    } finally {
      setIsUploadingCover(false);
    }
  };
  return (
    <Card className="mb-4 bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {profile.coverImageUrl ? (
          <img 
            src={profile.coverImageUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
        )}
        {profile.isOwnProfile && (
          <Button
            onClick={handleCoverImageClick}
            disabled={isUploadingCover}
            className="absolute bottom-4 right-4 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600"
            size="sm"
          >
            {isUploadingCover ? (
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            {isUploadingCover ? 'Salvando...' : 'Alterar capa'}
          </Button>
        )}
      </div>

      <CardContent className="p-6 mt-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-20 lg:-mt-24">
          {/* Profile Picture & Basic Info */}
          <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="relative">
              <UserAvatar
                src={profile.profileImageUrl}
                alt={profile.name}
                name={profile.name}
                className="w-32 h-32 lg:w-40 lg:h-40 border-4 border-slate-800 shadow-xl"
              />
              {profile.isOwnProfile && (
                <Button
                  onClick={handleProfileImageClick}
                  disabled={isUploadingProfile}
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-slate-700/80 hover:bg-slate-600/80 p-0"
                  size="sm"
                >
                  {isUploadingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </Button>
              )}
            </div>

            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">{profile.name}</h1>
                {/* Verified Badge */}
                {profile.isVerified && (
                  <div className="relative group">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200">
                      <svg 
                        className="w-4 h-4 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                      Conta verificada
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-slate-400 text-lg mb-1">@{profile.userName}</p>
              <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
                <button 
                  onClick={onFollowersClick}
                  className="flex items-center hover:text-white transition-colors cursor-pointer"
                >
                  <strong className="text-white mr-1">{profile.followersCount.toLocaleString()}</strong>
                  seguidores
                </button>
                <button 
                  onClick={onFollowingClick}
                  className="flex items-center hover:text-white transition-colors cursor-pointer"
                >
                  <strong className="text-white mr-1">{profile.followingCount.toLocaleString()}</strong>
                  seguindo
                </button>
                <span className="flex items-center">
                  <strong className="text-white mr-1">{profile.postsCount}</strong>
                  posts
                </span>
              </div>
            </div>
          </div>

          {/* Music & Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6 mt-4 lg:mt-0">
            {/* Music Player */}
            {musicPlayer}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {profile.isOwnProfile ? (
                <Button
                  onClick={onEditProfile}
                  variant="outline"
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={onFollow}
                    className={`${
                      isFollowing 
                        ? 'bg-slate-600 text-white hover:bg-red-500 hover:text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    } px-6`}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Mensagem
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={profileImageRef}
        onChange={handleProfileImageChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={coverImageRef}
        onChange={handleCoverImageChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </Card>
  );
};

export default ProfileHeader;