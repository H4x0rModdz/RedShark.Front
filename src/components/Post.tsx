"use client";

import React, { useState } from 'react';
import { IPost } from '@/types/IPost';
import { IComment } from '@/types/IComment';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import LikeService from '@/services/LikeService';
import CommentService from '@/services/CommentService';
import { LoadingButton, LoadingSpinner } from '@/components/ui/loading';
import { UserAvatar } from '@/components/ui/user-avatar';

interface PostProps {
  post: IPost;
}

const Post: React.FC<PostProps> = React.memo(({ post }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [comments, setComments] = useState<IComment[]>(
    (post.comments || []).map(comment => ({
      ...comment,
      isLiked: comment.isLiked || false
    }))
  );
  const [newComment, setNewComment] = useState('');
  const router = useRouter();
  
  // Check if this is the current user's post
  const isOwnPost = session?.user?.id === post.userId;
  const isCurrentUser = session?.user?.userName === post.userName;

  // Estados para o modal/carousel de imagens
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Loading states
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [likeCommentLoading, setLikeCommentLoading] = useState<string | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleLike = async () => {
    if (!session?.user?.id || isLikeLoading) return;
    
    console.log('handleLike called with:', { 
      postId: post.id, 
      userIdOriginal: session.user.id, 
      userIdParsed: parseInt(session.user.id),
      userIdType: typeof session.user.id 
    });
    setIsLikeLoading(true);
    try {
      const result = await LikeService.toggleLike({
        userId: session.user.id,
        postId: post.id
      });
      
      console.log('toggleLike result:', result);
      
      if (result.success) {
        setIsLiked(result.isLiked);
        setLikes(result.likesCount);
        console.log('State updated:', { isLiked: result.isLiked, likesCount: result.likesCount });
      }
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.id) return;
    
    try {
      if (isFollowing) {
        // Unfollow logic - this would need a follower endpoint
        console.log('Unfollow functionality needs to be implemented');
      } else {
        // Follow logic - this would need a follower endpoint
        console.log('Follow functionality needs to be implemented');
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Erro ao processar follow:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !session?.user?.id || isAddingComment) return;
    
    setIsAddingComment(true);
    try {
      const newCommentObj = await CommentService.createComment({
        postId: post.id,
        content: newComment.trim()
      });
      
      setComments([...comments, {
        ...newCommentObj,
        isLiked: false,
        likesCount: newCommentObj.likesCount || 0,
        commentsCount: newCommentObj.commentsCount || 0
      }]);
      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session?.user?.id || likeCommentLoading === commentId) return;
    
    console.log('handleLikeComment called with:', { 
      commentId, 
      userIdOriginal: session.user.id, 
      userIdParsed: parseInt(session.user.id),
      userIdType: typeof session.user.id 
    });
    setLikeCommentLoading(commentId);
    
    try {
      const result = await LikeService.toggleCommentLike({
        userId: session.user.id,
        commentId: commentId
      });
      
      console.log('toggleCommentLike result:', result);
      
      if (result.success) {
        setComments(prevComments => 
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return { 
                ...comment, 
                likesCount: result.likesCount,
                isLiked: result.isLiked
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    } finally {
      setLikeCommentLoading(null);
    }
  };

  const navigateToProfile = (username: string) => {
    const sanitizedUsername = username.replace(/^@/, '');
    router.push(`/profile/${sanitizedUsername}`);
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const prevImage = () => {
    if (post.images) {
      setCurrentImageIndex((prev) => (prev - 1 + post.images!.length) % post.images!.length);
    }
  };

  const nextImage = () => {
    if (post.images) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images!.length);
    }
  };

  return (
    <Card key={post.id} className="bg-slate-800/60 border-slate-700/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 flex flex-col space-y-4">
        {/* Cabeçalho do Post */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 flex-1">
            <div 
              onClick={() => navigateToProfile(post.userName)}
              className="cursor-pointer"
            >
              <UserAvatar
                src={post.userImage}
                alt={post.name}
                name={post.name}
                className="w-12 h-12 ring-2 ring-slate-600 hover:ring-blue-500 transition-all duration-200"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-white">{post.name}</p>
                  <span 
                    className="text-slate-400 cursor-pointer hover:text-blue-400 transition-colors"
                    onClick={() => navigateToProfile(post.userName)}
                  >
                    @{post.userName}
                  </span>
                  {isOwnPost && (
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Você
                    </span>
                  )}
                </div>
                {!isOwnPost && (
                  <Button 
                    onClick={handleFollow} 
                    className={`text-sm px-4 py-1.5 h-auto rounded-full font-medium transition-all duration-200 ${
                      isFollowing 
                        ? 'bg-slate-600 text-white hover:bg-red-500 hover:text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                    }`}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                )}
              </div>
              <p className="mt-3 text-slate-100 leading-relaxed">{post.content}</p>
            </div>
          </div>
        </div>

        {/* Seção de Imagens */}
        {post.images && post.images.length > 0 && (
          <>
            {post.images.length === 1 ? (
              /* Caso só haja 1 imagem */
              <div className="w-full h-64">
                <img
                  src={post.images[0].imageUrl}
                  alt="Post image"
                  className="w-full h-full rounded-lg cursor-pointer object-cover"
                  onClick={() => openModal(0)}
                />
              </div>
            ) : (
              /* Caso haja várias imagens, exibe no grid */
              <div className="grid grid-cols-2 gap-2">
                {post.images.slice(0, 4).map((image, index) => {
                  // Se tiver mais de 4, a última exibe o +N
                  if (index === 3 && post.images && post.images.length > 4) {
                    return (
                      <div key={index} className="relative w-full h-64">
                        <img
                          src={image.imageUrl}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-full rounded-lg cursor-pointer object-cover"
                          onClick={() => openModal(index)}
                        />
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-2xl cursor-pointer"
                          onClick={() => openModal(index)}
                        >
                          +{post.images.length - 4}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={index} className="w-full h-64">
                      <img
                        src={image.imageUrl}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-full rounded-lg cursor-pointer object-cover"
                        onClick={() => openModal(index)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Ações do Post */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center space-x-8">
            <LoadingButton 
              onClick={handleLike} 
              isLoading={isLikeLoading}
              className={`bg-transparent text-slate-400 hover:text-red-400 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2 ${
                isLiked ? 'text-red-400' : ''
              }`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{likes}</span>
            </LoadingButton>
            
            <Button className="bg-transparent text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{comments.length}</span>
            </Button>

            <Button className="bg-transparent text-slate-400 hover:text-green-400 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </Button>
          </div>

          <Button className="bg-transparent text-slate-400 hover:text-slate-300 transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </Button>
        </div>

        {/* Comentários */}
        <div className="mt-6 space-y-4">
          {comments.length > 0 && (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                    <div 
                      onClick={() => navigateToProfile(comment.userName)}
                      className="cursor-pointer"
                    >
                      <UserAvatar
                        src={comment.userImage}
                        alt={comment.name}
                        name={comment.name}
                        className="w-8 h-8 ring-1 ring-slate-600 hover:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white text-sm">{comment.name}</p>
                          <span 
                            className="text-slate-400 text-xs cursor-pointer hover:text-blue-400 transition-colors"
                            onClick={() => navigateToProfile(comment.userName)}
                          >
                            @{comment.userName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-300 text-xs">{comment.likesCount || 0}</span>
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            disabled={likeCommentLoading === comment.id}
                            className={`p-1 hover:bg-slate-600 rounded transition-colors ${
                              likeCommentLoading === comment.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {likeCommentLoading === comment.id ? (
                              <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                            ) : comment.isLiked ? (
                              <AiFillHeart className="text-red-400 text-sm" />
                            ) : (
                              <AiOutlineHeart className="text-slate-400 text-sm hover:text-red-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-slate-200 text-sm leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {/* Comment Input */}
          <div className="flex items-center space-x-3 p-4 bg-slate-700/20 rounded-lg">
            <img
              src={session?.user?.image || 'https://github.com/shadcn.png'}
              alt="Seu avatar"
              className="w-8 h-8 rounded-full ring-1 ring-slate-600"
            />
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                placeholder="Adicionar um comentário..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <LoadingButton
                onClick={handleAddComment}
                isLoading={isAddingComment}
                disabled={!newComment.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 px-4 py-1.5 rounded text-sm"
              >
                {!isAddingComment && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </LoadingButton>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Modal com Carousel de Imagens com tamanho fixo */}
      {isModalOpen && post.images && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal} // Fecha o modal ao clicar fora
        >
          <div
            className="relative w-[600px] h-[400px] bg-gray-800 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Evita fechar o modal ao clicar dentro
          >
            <button
              onClick={prevImage}
              className="absolute left-2 text-white text-3xl"
            >
              &#8249;
            </button>
            <img
              src={post.images[currentImageIndex].imageUrl}
              alt={`Carousel image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={nextImage}
              className="absolute right-2 text-white text-3xl"
            >
              &#8250;
            </button>
          </div>
        </div>
      )}
    </Card>
  );
});

// Add display name for debugging
Post.displayName = 'Post';

export default Post;
