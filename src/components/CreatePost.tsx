"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import PostService from "@/services/PostService";

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video' | 'link', data: any } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Character count with color indicators
  const getCharacterStatus = () => {
    const length = content.length;
    const maxLength = 2000;
    
    if (length <= 1500) return { color: 'text-green-400', status: 'safe' };
    if (length <= 1800) return { color: 'text-yellow-400', status: 'warning' };
    return { color: 'text-red-400', status: 'danger' };
  };

  const characterStatus = getCharacterStatus();
  const remainingChars = 2000 - content.length;

  // Auto resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= 2000) {
      setContent(newContent);
      adjustTextareaHeight();
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      adjustTextareaHeight();
    }, 100);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setContent('');
    setSelectedMedia(null);
  };

  const handlePost = async () => {
    if (!content.trim() || !session?.user?.id || isPosting) return;

    setIsPosting(true);
    try {
      const response = await PostService.createPost({
        content: content.trim(),
        userId: session.user.id,
      });

      if (response.success) {
        onPostCreated();
        handleCollapse();
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  // File upload handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedMedia({ type: 'image', data: file });
      } else if (file.type.startsWith('video/')) {
        setSelectedMedia({ type: 'video', data: file });
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedMedia({ type: 'image', data: file });
      } else if (file.type.startsWith('video/')) {
        setSelectedMedia({ type: 'video', data: file });
      }
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`mb-8 transition-all duration-500 backdrop-blur-sm ${
        isExpanded 
          ? 'bg-slate-800/80 border-blue-500/30 shadow-2xl shadow-blue-500/10' 
          : 'bg-slate-800/60 border-slate-700/50 shadow-xl hover:shadow-2xl hover:bg-slate-800/70'
      } ${dragActive ? 'border-blue-400 bg-blue-500/10' : ''}`}>
        <CardContent 
          className="p-6"
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex items-start space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <UserAvatar
                src={session?.user?.image}
                alt={session?.user?.name}
                name={session?.user?.name}
                className="w-12 h-12 ring-2 ring-slate-600/50 hover:ring-blue-500/70 transition-all duration-300"
              />
            </motion.div>

            <div className="flex-1">
              {/* Main text area */}
              <motion.div
                className="relative"
                layout
                transition={{ duration: 0.3 }}
              >
                {!isExpanded ? (
                  <motion.div
                    className="cursor-pointer p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300"
                    onClick={handleExpand}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <p className="text-slate-400 text-lg">
                      O que você está pensando, {session?.user?.name?.split(' ')[0]}? ✨
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        className="w-full bg-transparent text-white text-lg placeholder-slate-400 outline-none resize-none min-h-[120px] leading-relaxed"
                        placeholder="Compartilhe suas ideias..."
                        value={content}
                        onChange={handleContentChange}
                        rows={4}
                        onInput={adjustTextareaHeight}
                      />
                      
                      {/* Character counter bubble */}
                      <motion.div
                        className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                          characterStatus.status === 'safe' ? 'bg-green-500/20 text-green-400' :
                          characterStatus.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            characterStatus.status === 'safe' ? 'bg-green-400' :
                            characterStatus.status === 'warning' ? 'bg-yellow-400' :
                            'bg-red-400'
                          }`} />
                          <span>{remainingChars}</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Media preview */}
                    <AnimatePresence>
                      {selectedMedia && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="relative"
                        >
                          <div className="bg-slate-700/30 rounded-xl p-4 relative">
                            <button
                              onClick={() => setSelectedMedia(null)}
                              className="absolute top-2 right-2 w-8 h-8 bg-slate-800/80 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-colors"
                            >
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <p className="text-slate-300">
                              {selectedMedia.type === 'image' ? '📷' : '🎥'} {selectedMedia.data.name}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Media options */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between pt-4 border-t border-slate-700/50"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Photo upload */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm font-medium">Mídia</span>
                        </motion.button>

                        {/* Link option */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-purple-500/20 text-slate-300 hover:text-purple-400 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="text-sm font-medium">Link</span>
                        </motion.button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCollapse}
                          className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                        >
                          Cancelar
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePost}
                          disabled={!content.trim() || isPosting || remainingChars < 0}
                          className={`px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 ${
                            !content.trim() || isPosting || remainingChars < 0
                              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                          }`}
                        >
                          {isPosting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Publicando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              <span>Publicar</span>
                            </div>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Drag and drop overlay */}
          <AnimatePresence>
            {dragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-blue-400 font-semibold text-lg">Solte sua imagem ou vídeo aqui</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </motion.div>
  );
};

export default CreatePost;