"use client";

import React, { useEffect, useState } from "react";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Post from "@/components/Post";
import { IPost } from "@/types/IPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeedService from "@/services/FeedService";
import { useSession } from "next-auth/react";
import PostService from "@/services/PostService";
import { FeedSkeleton, PostSkeleton } from "@/components/ui/skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import FeedErrorBoundary from "@/components/FeedErrorBoundary";

const HomePage = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [fetchedCursors, setFetchedCursors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [expandCreatePost, setExpandCreatePost] = useState(false);

  const fetchFeed = async (cursor?: string) => {
    if (!session?.user?.id) return;

    if (cursor && fetchedCursors.includes(cursor)) {
      return;
    }

    setLoading(true);
    try {
      const { posts: fetchedPosts, nextCursor: fetchedCursor } =
        await FeedService.getFeed(session.user.id, cursor);

      setPosts((prevPosts) => {
        const newPosts = fetchedPosts.filter(
          (post) => !prevPosts.find((p) => p.id === post.id)
        );
        return [...prevPosts, ...newPosts];
      });

      if (fetchedCursor) {
        setFetchedCursors((prev) => [...prev, fetchedCursor]);
      }
      setNextCursor(fetchedCursor);
    } catch (error) {
      console.error("Erro ao buscar o feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !session?.user?.id || isCreatingPost) return;

    setIsCreatingPost(true);
    try {
      const response = await PostService.createPost({
        content: newPostContent.trim(),
        userId: session.user.id,
      });

      if (response.success) {
        const newPost: IPost = {
          id: response.postId,
          userId: session.user.id,
          content: newPostContent.trim(),
          name: session.user?.name || 'User',
          userName: session.user?.userName || session.user?.name?.toLowerCase().replace(' ', '_') || 'user',
          userImage: session.user?.image || 'https://github.com/shadcn.png',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          comments: [],
          images: [],
          isFollowing: false,
          isLiked: false,
        };
        
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setNewPostContent('');
        setExpandCreatePost(false);
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar post. Tente novamente.');
    } finally {
      setIsCreatingPost(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchFeed();
    }
  }, [session]);

  // Debounce the scroll handler to avoid excessive API calls
  const debouncedFetchFeed = useDebounce((cursor: string) => {
    fetchFeed(cursor);
  }, 300); // 300ms debounce

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 1000 && // Load before reaching bottom
        !loading &&
        nextCursor
      ) {
        debouncedFetchFeed(nextCursor);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, nextCursor, debouncedFetchFeed]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg font-medium">Carregando Red Shark...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <div className="flex max-w-7xl mx-auto">
        <LeftSidebar />
        
        <main className="flex-1 max-w-2xl mx-auto px-4 pt-20 pb-8">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Feed Principal
                </h1>
                <p className="text-slate-400 text-sm">Descubra o que está acontecendo</p>
              </div>
            </div>
          </div>

          {/* Enhanced Post Creation Card */}
          <Card className="mb-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  src={session?.user?.image || 'https://github.com/shadcn.png'}
                  alt="Seu avatar"
                  className="w-12 h-12 rounded-full ring-2 ring-slate-600"
                />
                <div className="flex-1">
                  <div 
                    className={`transition-all duration-300 ${expandCreatePost ? 'min-h-32' : 'min-h-16'}`}
                    onClick={() => setExpandCreatePost(true)}
                  >
                    <textarea
                      className="w-full bg-transparent text-white placeholder-slate-400 outline-none resize-none text-lg leading-relaxed"
                      placeholder={expandCreatePost ? "Compartilhe suas ideias..." : "O que você está pensando?"}
                      rows={expandCreatePost ? 4 : 2}
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      onPaste={(e) => {
                        const paste = (e.clipboardData || (window as any).clipboardData).getData('text');
                        const newText = newPostContent + paste;
                        if (newText.length > 2000) {
                          e.preventDefault();
                          const remainingChars = 2000 - newPostContent.length;
                          if (remainingChars > 0) {
                            setNewPostContent(newPostContent + paste.substring(0, remainingChars));
                          }
                        }
                      }}
                      maxLength={2000}
                    />
                  </div>
                  
                  {expandCreatePost && (
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      {/* Post Options */}
                      <div className="flex items-center space-x-6 text-slate-400">
                        <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">Fotos</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                          </svg>
                          <span className="text-sm">Enquete</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-yellow-400 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 5a9 9 0 110 18 9 9 0 010-18z" />
                          </svg>
                          <span className="text-sm">Emoji</span>
                        </button>
                      </div>

                      {/* Action Bar */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm transition-colors ${newPostContent.length > 1800 ? 'text-red-400' : 'text-slate-400'}`}>
                            {newPostContent.length}/2000
                          </span>
                          {newPostContent.length > 0 && (
                            <div className={`w-2 h-2 rounded-full transition-colors ${newPostContent.length > 1800 ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button 
                            onClick={() => {
                              setExpandCreatePost(false);
                              setNewPostContent('');
                            }}
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim() || isCreatingPost}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 font-medium px-6 shadow-lg"
                          >
                            {isCreatingPost ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Postando...</span>
                              </div>
                            ) : 'Publicar'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!expandCreatePost && newPostContent.trim() && (
                    <div className="mt-2 flex justify-end">
                      <Button 
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim() || isCreatingPost}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Publicar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State with Skeleton */}
          {loading && posts.length === 0 && <FeedSkeleton count={3} />}
          {loading && posts.length > 0 && <PostSkeleton />}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 && !loading ? (
              <Card className="bg-slate-800/30 border-slate-700/30">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Seu feed está vazio</h3>
                  <p className="text-slate-400 mb-6">Comece seguindo pessoas ou crie seu primeiro post!</p>
                  <Button 
                    onClick={() => setExpandCreatePost(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Criar primeiro post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <FeedErrorBoundary key={post.id}>
                  <div className="transform transition-all duration-200 hover:scale-[1.01]">
                    <Post post={post} />
                  </div>
                </FeedErrorBoundary>
              ))
            )}
          </div>

          {/* Loading indicator when auto-loading */}
          {loading && (
            <div className="mt-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 mt-2">Carregando mais posts...</p>
            </div>
          )}
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default HomePage;
