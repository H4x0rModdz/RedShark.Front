import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Post from '@/components/Post';
import { IPost } from '@/types/IPost';
import { UserProfile } from '@/types/IUserProfile';

interface ProfilePostsProps {
  posts: IPost[];
  postsCount: number;
  profile: UserProfile;
  onViewAllPosts: () => void;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  posts,
  postsCount,
  profile,
  onViewAllPosts
}) => {
  if (posts.length === 0) {
    return (
      <Card className="bg-slate-800/30 border-slate-700/30">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum post ainda</h3>
          <p className="text-slate-400">
            {profile.isOwnProfile ? 'Compartilhe seus primeiros pensamentos!' : 'Este usuario ainda nao publicou nada.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts List */}
      {posts.map((post) => (
        <div key={post.id} className="transform transition-all duration-200 hover:scale-[1.01]">
          <Post post={post} />
        </div>
      ))}

      {/* View All Posts Button */}
      {postsCount > 4 && (
        <Card className="bg-slate-800/30 border-slate-700/30">
          <CardContent className="p-8 text-center">
            <p className="text-slate-300 mb-4">
              Mostrando 4 de {postsCount} posts
            </p>
            <Button
              onClick={onViewAllPosts}
              variant="outline"
              className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Ver todos os posts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePosts;