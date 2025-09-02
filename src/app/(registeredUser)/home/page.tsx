"use client";

import React, { useState } from "react";
import Post from "@/components/Post";
import { IPost } from "@/types/IPost";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { FeedSkeleton, PostSkeleton } from "@/components/ui/skeletons";
import FeedErrorBoundary from "@/components/FeedErrorBoundary";
import { motion } from "framer-motion";
import { useAppData } from "@/components/AppLoader";
import CreatePost from "@/components/CreatePost";

const HomePage = () => {
  const { data: session, status } = useSession();
  const { feed, feedLoading, loadFeed } = useAppData();

  // Load more posts on scroll
  const handleLoadMore = () => {
    if (feed?.nextCursor && !feedLoading) {
      loadFeed(feed.nextCursor);
    }
  };

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

  const posts = feed?.posts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      <div className="flex">
        <div className="flex-1 max-w-2xl mx-auto px-4 pt-20 pb-8">
          {/* Header */}
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

          {/* Post Creation Component */}
          <CreatePost onPostCreated={loadFeed} />

          {/* Feed Loading State */}
          {feedLoading && posts.length === 0 && <FeedSkeleton count={3} />}

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length === 0 && !feedLoading ? (
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
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

          {/* Load More Button */}
          {feed?.nextCursor && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleLoadMore}
                disabled={feedLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {feedLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Carregando...</span>
                  </div>
                ) : (
                  'Carregar mais posts'
                )}
              </Button>
            </div>
          )}

          {/* Loading indicator for pagination */}
          {feedLoading && posts.length > 0 && (
            <div className="mt-8 text-center">
              <PostSkeleton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;