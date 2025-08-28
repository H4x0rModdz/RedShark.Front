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

const Post: React.FC<{ post: IPost }> = ({ post }) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [comments, setComments] = useState<IComment[]>(
    (post.comments || []).map(comment => ({
      ...comment,
      isLiked: comment.isLiked || false,
      avatar: comment.avatar || 'https://github.com/shadcn.png'
    }))
  );
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);
  const router = useRouter();
  
  // Check if this is the current user's post
  const isOwnPost = session?.user?.id === post.userId?.toString();
  const isCurrentUser = session?.user?.userName === post.userName;

  // Estados para o modal/carousel de imagens
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = async () => {
    if (!session?.user?.id || isProcessingLike) return;
    
    setIsProcessingLike(true);
    try {
      if (isLiked) {
        // Remove like - Note: We'd need the like ID to delete it properly
        // For now, this is a simplified approach
        console.log('Unlike functionality needs like ID from backend');
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        // Add like
        await LikeService.createLike({
          userId: session.user.id,
          postId: post.id
        });
        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Erro ao processar like:', error);
      // Revert optimistic update on error
      if (isLiked) {
        setLikes(likes + 1);
        setIsLiked(true);
      } else {
        setLikes(likes - 1);
        setIsLiked(false);
      }
    } finally {
      setIsProcessingLike(false);
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
    if (!newComment.trim() || !session?.user?.id || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      // Note: Comment functionality needs to be implemented in backend
      // For now, we'll add comments locally until the API is ready
      const newCommentObj: IComment = {
        id: Date.now(), // temporary ID
        user: session.user.name || 'User',
        userName: session.user.userName ? `@${session.user.userName}` : `@${session.user.name?.toLowerCase().replace(' ', '_')}`,
        avatar: session.user.image || 'https://github.com/shadcn.png',
        content: newComment.trim(),
        likes: 0,
        isLiked: false,
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
      
      // TODO: Implement actual API call when Comment controller is created
      console.log('Comment API not yet implemented - comment added locally');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikeComment = (commentId: number) => {
    const updatedComments = comments.map((comment) => {
      // Se o comentário for o que foi clicado:
      if (comment.id === commentId) {
        // Se já foi curtido, remove o like; caso contrário, adiciona
        const isAlreadyLiked = (comment as any).isLiked;
        const updatedLikes = (comment.likes || 0) + (isAlreadyLiked ? -1 : 1);
        return { ...comment, likes: updatedLikes, isLiked: !isAlreadyLiked };
      }
      return comment;
    });
    setComments(updatedComments);
    // Lógica para persistir a ação de like no backend
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
            <img
              src={post.userImage}
              alt={post.name}
              className="w-12 h-12 rounded-full cursor-pointer ring-2 ring-slate-600 hover:ring-blue-500 transition-all duration-200"
              onClick={() => navigateToProfile(post.userName)}
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <p className="font-bold text-white">{post.name}</p>
                  <span className="text-slate-400">@{post.userName}</span>
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
            <Button 
              onClick={handleLike} 
              disabled={isProcessingLike}
              className={`bg-transparent text-slate-400 hover:text-red-400 disabled:opacity-50 transition-colors duration-200 flex items-center space-x-2 ${
                isLiked ? 'text-red-400' : ''
              }`}
            >
              <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">{likes}</span>
            </Button>
            
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
                    <img
                      src={comment.avatar || 'https://github.com/shadcn.png'}
                      alt={comment.user}
                      className="w-8 h-8 rounded-full cursor-pointer ring-1 ring-slate-600 hover:ring-blue-500 transition-all duration-200"
                      onClick={() => navigateToProfile(comment.userName)}
                      onError={(e) => {
                        // Fallback para imagem padrão se a imagem falhar
                        (e.target as HTMLImageElement).src = 'https://github.com/shadcn.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white text-sm">{comment.user}</p>
                          <span className="text-slate-400 text-xs">{comment.userName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-slate-300 text-xs">{comment.likes || 0}</span>
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className="p-1 hover:bg-slate-600 rounded transition-colors"
                          >
                            {comment.isLiked ? (
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
              <Button
                onClick={handleAddComment}
                disabled={isSubmittingComment || !newComment.trim()}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 px-4"
              >
                {isSubmittingComment ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </Button>
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
};

export default Post;
