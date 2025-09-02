"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Post from '@/components/Post';
import FollowersModal from '@/components/FollowersModal';
import PostsModal from '@/components/PostsModal';
import ProfileAbout from '@/components/profile/ProfileAbout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileMusicPlayer from '@/components/profile/ProfileMusicPlayer';
import ProfilePhotos from '@/components/profile/ProfilePhotos';
import ProfileBadges from '@/components/profile/ProfileBadges';
import ProfilePosts from '@/components/profile/ProfilePosts';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { type UserProfile as ProfileUserProfile } from '@/types/IUserProfile';
import { type UserBadge } from '@/types/IUserBadge';
import { type FollowerData } from '@/types/IFollowerData';
import { IPost } from '@/types/IPost';
import FollowerService, { FollowerDto, FollowingDto } from '@/services/FollowerService';
import PostService from '@/services/PostService';
import spotifyService from '@/services/SpotifyService';
import { useAudio } from '@/contexts/AudioContext';

// Interface para dados de seguidor/seguindo exibidos no modal
type FollowerDataType = FollowerData;

type UserProfile = ProfileUserProfile;

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const username = params?.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'badges' | 'photos'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Modal states
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isPostsModalOpen, setIsPostsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>('followers');
  const [followersData, setFollowersData] = useState<FollowerData[]>([]);
  const [followingData, setFollowingData] = useState<FollowerData[]>([]);
  const [postsCount, setPostsCount] = useState(0);
  const [spotifyTrack, setSpotifyTrack] = useState<any>(null);
  const [musicLoading, setMusicLoading] = useState(false);
  const { currentTrack, isPlaying, currentTime, duration, play, pause } = useAudio();


  // TODO: Replace with real badges API when available
  const userBadges: UserBadge[] = [];

  // Fetch followers and following data
  const fetchFollowersData = async (userId: string) => {
    try {
      const [followers, following, followersCount, followingCount] = await Promise.all([
        FollowerService.getFollowers(userId, 1, 50), // Get first 50 followers
        FollowerService.getFollowing(userId, 1, 50), // Get first 50 following
        FollowerService.getFollowersCount(userId),
        FollowerService.getFollowingCount(userId)
      ]);

      // Transform API data to frontend format
      const transformedFollowers: FollowerData[] = followers.map((follower: FollowerDto) => ({
        id: follower.followerId,
        displayName: follower.followerDisplayName,
        username: follower.followerUsername,
        profileImage: follower.followerProfileImage || 'https://github.com/shadcn.png',
        amIFollowingThisPerson: follower.doIFollowThisPerson
      }));

      const transformedFollowing: FollowerData[] = following.map((follow: FollowingDto) => ({
        id: follow.followingId,
        displayName: follow.followingDisplayName,
        username: follow.followingUsername,
        profileImage: follow.followingProfileImage || 'https://github.com/shadcn.png',
        amIFollowingThisPerson: follow.doIFollowThisPerson
      }));

      setFollowersData(transformedFollowers);
      setFollowingData(transformedFollowing);

      return { followersCount, followingCount };
    } catch (error) {
      console.error('Erro ao buscar dados de followers:', error);
      return { followersCount: 0, followingCount: 0 };
    }
  };

  // Fetch Spotify track
  const fetchSpotifyTrack = async (trackId: string) => {
    if (!trackId) return;
    
    setMusicLoading(true);
    try {
      const track = await spotifyService.getTrack(trackId);
      setSpotifyTrack(track);
    } catch (error) {
      console.error('Error fetching Spotify track:', error);
      setSpotifyTrack(null);
    } finally {
      setMusicLoading(false);
    }
  };

  // Fetch user profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Fetch user profile with all necessary data
        const response = await fetch(`${apiUrl}/api/user/profile/${username}`, {
          headers: {
            'Authorization': `Bearer ${session?.user?.token || ''}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar perfil do usuário');
        }

        const profileData = await response.json();
        
        // Fetch followers/following data and posts
        const [
          { followersCount, followingCount },
          initialPosts,
          totalPostsCount
        ] = await Promise.all([
          fetchFollowersData(profileData.id.toString()),
          PostService.getPostsByUserId(profileData.id.toString(), 1, 4), // Only get first 4 posts
          PostService.getPostsCountByUserId(profileData.id.toString())
        ]);
        
        // Transform API data to match frontend interface
        const transformedProfile: UserProfile = {
          id: profileData.id.toString(),
          name: profileData.name,
          userName: profileData.userName,
          email: profileData.email,
          profileImageUrl: profileData.profileImageUrl || 'https://github.com/shadcn.png',
          coverImageUrl: profileData.coverImageUrl,
          bio: profileData.biography,
          location: profileData.location,
          website: profileData.website,
          profession: profileData.profession,
          birthDate: profileData.birthDate,
          maritalStatus: profileData.maritalStatus,
          joinedDate: profileData.createdAt,
          followersCount: followersCount,
          followingCount: followingCount,
          postsCount: totalPostsCount,
          isFollowing: false, // TODO: Implement follow status check
          isOwnProfile: session?.user?.userName === username,
          isVerified: profileData.isVerified || false,
          profileMusic: profileData.profileMusic
        };

        // Use posts data as-is from API (only first 4)
        const transformedPosts: IPost[] = initialPosts.map((post: any) => ({
          ...post,
          images: post.images || [],
          isFollowing: false
        }));

        setProfile(transformedProfile);
        setPosts(transformedPosts);
        setPostsCount(totalPostsCount);
        setIsFollowing(transformedProfile.isFollowing || false);

        // Fetch Spotify track if user has one configured
        if (transformedProfile.profileMusic) {
          await fetchSpotifyTrack(transformedProfile.profileMusic);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        
        // No fallback to mock data - just show error state or empty data
        setProfile(null);
        setPosts([]);
        setFollowersData([]);
        setFollowingData([]);
        setIsFollowing(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, session]);

  const handleFollow = async () => {
    if (!profile) return;
    
    try {
      const success = await FollowerService.toggleFollow(profile.id, isFollowing);
      
      if (success) {
        setIsFollowing(!isFollowing);
        setProfile({
          ...profile,
          followersCount: isFollowing ? profile.followersCount - 1 : profile.followersCount + 1
        });
      }
    } catch (error) {
      console.error('Erro ao processar follow:', error);
      // Show error message to user
      alert('Erro ao processar a solicitação. Tente novamente.');
    }
  };

  const handleFollowersClick = () => {
    setModalType('followers');
    setIsFollowersModalOpen(true);
  };

  const handleFollowingClick = () => {
    setModalType('following');
    setIsFollowersModalOpen(true);
  };

  const handleModalFollowToggle = async (username: string, currentlyFollowing: boolean) => {
    try {
      // Find user ID by username in the appropriate data array
      const targetData = modalType === 'followers' ? followersData : followingData;
      const targetUser = targetData.find(user => user.username === username);
      
      if (!targetUser) {
        console.error('Usuário não encontrado:', username);
        return;
      }

      const success = await FollowerService.toggleFollow(targetUser.id, currentlyFollowing);
      
      if (success) {
        // Update local state
        if (modalType === 'followers') {
          setFollowersData(prev => 
            prev.map(follower => 
              follower.username === username 
                ? { ...follower, amIFollowingThisPerson: !currentlyFollowing }
                : follower
            )
          );
        } else {
          setFollowingData(prev => 
            prev.map(following => 
              following.username === username 
                ? { ...following, amIFollowingThisPerson: !currentlyFollowing }
                : following
            )
          );
        }
      }
    } catch (error) {
      console.error('Erro ao processar follow:', error);
      alert('Erro ao processar a solicitação. Tente novamente.');
    }
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile modal/page
    console.log('Edit profile clicked');
  };

  const handleViewAllPosts = () => {
    setIsPostsModalOpen(true);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handlePlayPause = () => {
    if (!spotifyTrack) return;

    const previewUrl = spotifyTrack.preview_url;
    const trackId = spotifyTrack.id;

    // If no preview, don't do anything (button should be disabled)
    if (!previewUrl) {
      return;
    }

    // If this track is currently playing, toggle pause/play
    if (currentTrack === trackId) {
      if (isPlaying) {
        pause();
      } else {
        play(previewUrl, trackId);
      }
    } else {
      // Play new track
      play(previewUrl, trackId);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-slate-800/60 border-slate-700/60 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Usuário não encontrado</h2>
            <p className="text-slate-400 mb-6">O perfil que você está procurando não existe.</p>
            <Button 
              onClick={() => router.push('/home')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Voltar ao Feed
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          height: 4px;
          border-radius: 2px;
        }
        
        .slider::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: #475569;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <div className="max-w-6xl mx-auto pt-20">
        {/* Profile Header */}
        <div className="mb-4">
          <ProfileHeader
            profile={profile}
            isFollowing={isFollowing}
            onFollow={handleFollow}
            onEditProfile={handleEditProfile}
            onFollowersClick={handleFollowersClick}
            onFollowingClick={handleFollowingClick}
            musicPlayer={(spotifyTrack || profile.profileMusic) ? (
              <ProfileMusicPlayer
                spotifyTrack={spotifyTrack}
                musicLoading={musicLoading}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
              />
            ) : undefined}
          />
        </div>

        {/* Profile Navigation & Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - About */}
          <div className="lg:w-2/5 space-y-4">
            <ProfileAbout profile={profile} />
            <div className="hidden lg:block">
              <ProfilePhotos userId={profile.id} />
            </div>
          </div>

          {/* Right Column - Posts */}
          <div className="lg:w-3/5">
            {/* Tab Navigation - Desktop (without Photos tab) */}
            <div className="hidden lg:block">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showPhotosTab={false}
              />
            </div>
            
            {/* Tab Navigation - Mobile (with Photos tab) */}
            <div className="lg:hidden">
              <ProfileTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showPhotosTab={true}
              />
            </div>

            {/* Posts Content */}
            {activeTab === 'posts' && (
              <ProfilePosts
                posts={posts}
                postsCount={postsCount}
                profile={profile}
                onViewAllPosts={handleViewAllPosts}
              />
            )}

            {/* Badges Content */}
            {activeTab === 'badges' && (
              <div className="hidden lg:block">
                <ProfileBadges userBadges={userBadges} />
              </div>
            )}

            {/* Badges Tab Content (mobile) */}
            {activeTab === 'badges' && (
              <div className="lg:hidden">
                <ProfileBadges userBadges={userBadges} isMobileView={true} />
              </div>
            )}

            {/* Photos Tab Content (mobile) */}
            {activeTab === 'photos' && (
              <div className="lg:hidden">
                <ProfilePhotos userId={profile.id} isMobileView={true} />
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Followers/Following Modal */}
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        followers={followersData}
        following={followingData}
        type={modalType}
        onFollowToggle={handleModalFollowToggle}
      />

      {/* Posts Modal */}
      {profile && (
        <PostsModal
          isOpen={isPostsModalOpen}
          onClose={() => setIsPostsModalOpen(false)}
          userId={profile.id}
          userName={profile.userName}
        />
      )}
    </>
  );
};

export default ProfilePage;