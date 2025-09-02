"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Post from '@/components/Post';
import { IPost } from '@/types/IPost';
import PostService from '@/services/PostService';

interface PostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const PostsModal: React.FC<PostsModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName
}) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 10;

  // Load initial posts
  const loadInitialPosts = useCallback(async () => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [initialPosts, count] = await Promise.all([
        PostService.getPostsByUserId(userId, 1, pageSize),
        PostService.getPostsCountByUserId(userId)
      ]);

      setPosts(initialPosts);
      setTotalCount(count);
      setCurrentPage(1);
      setHasMore(initialPosts.length < count);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setError('Erro ao carregar posts. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [isOpen, userId, pageSize]);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    try {
      const nextPage = currentPage + 1;
      const newPosts = await PostService.getPostsByUserId(userId, nextPage, pageSize);
      
      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setCurrentPage(nextPage);
        setHasMore(posts.length + newPosts.length < totalCount);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais posts:', error);
      setError('Erro ao carregar mais posts.');
    } finally {
      setLoadingMore(false);
    }
  }, [userId, currentPage, pageSize, loadingMore, hasMore, posts.length, totalCount]);

  // Intersection Observer for lazy loading
  const lastPostElementRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px' // Load more when 100px before reaching the end
    });
    
    if (node) observerRef.current.observe(node);
    lastPostElementRef.current = node;
  }, [loadingMore, hasMore, loadMorePosts]);

  // Load posts when modal opens
  useEffect(() => {
    if (isOpen) {
      loadInitialPosts();
    } else {
      // Reset state when modal closes
      setPosts([]);
      setCurrentPage(1);
      setHasMore(true);
      setTotalCount(0);
      setError(null);
    }
  }, [isOpen, loadInitialPosts]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

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
        <Card className="bg-slate-900 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Posts de @{userName}
                {totalCount > 0 && (
                  <span className="text-slate-400 ml-2">({totalCount})</span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-0 overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Carregando posts...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-400">
                <p>{error}</p>
                <Button 
                  onClick={loadInitialPosts}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Tentar Novamente
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum post encontrado</h3>
                <p>Este usuário ainda não publicou nada.</p>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {posts.map((post, index) => {
                  // Add ref to last element for intersection observer
                  const isLastElement = index === posts.length - 1;
                  
                  return (
                    <div 
                      key={post.id} 
                      ref={isLastElement ? lastPostElementRefCallback : null}
                      className="transform transition-all duration-200 hover:scale-[1.01]"
                    >
                      <Post post={post} />
                    </div>
                  );
                })}

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="py-8 text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-slate-400 text-sm">Carregando mais posts...</p>
                  </div>
                )}

                {/* End of posts indicator */}
                {!hasMore && posts.length > 0 && (
                  <div className="py-8 text-center text-slate-500">
                    <p>Todos os posts foram carregados</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PostsModal;