import React, { useState, useEffect, useCallback } from 'react';
import { useOptimizedSession } from '@/hooks/useOptimizedSession';
import { IChat } from '@/types/IChat';
import { IChatMessage } from '@/types/IChatMessage';
import ChatService from '@/services/ChatService';
import { useSimpleCache } from '@/hooks/useSimpleCache';
import { UserAvatar } from '@/components/ui/user-avatar';
import { ChatListSkeleton, MessageSkeleton } from '@/components/ui/skeletons';
import { NotificationService } from '@/services/NotificationService';

const RightSidebar = () => {
  const { session, isAuthenticated } = useOptimizedSession();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [signalRConnection, setSignalRConnection] = useState<any>(null);

  // Cached fetch for user chats
  const {
    data: chats,
    loading,
    error: chatsError
  } = useSimpleCache(
    isAuthenticated ? `user-chats-${session?.user?.id}` : '',
    () => ChatService.getUserChats(),
    2 * 60 * 1000 // 2 minutes cache
  );

  // Cached fetch for chat messages
  const {
    data: cachedMessages,
    loading: messagesLoadingCached,
    error: messagesError
  } = useSimpleCache(
    activeChat ? `chat-messages-${activeChat}` : '',
    () => ChatService.getChatMessages(activeChat!, 1, 50),
    1 * 60 * 1000 // 1 minute cache
  );

  // Update local messages state when cached data changes
  useEffect(() => {
    if (cachedMessages) {
      setMessages(cachedMessages);
    } else if (!activeChat) {
      setMessages([]);
    }
    setMessagesLoading(messagesLoadingCached);
  }, [cachedMessages, activeChat, messagesLoadingCached]);

  // POLLING METHOD (COMMENTED OUT - WORKING BACKUP)
  // useEffect(() => {
  //   if (!isAuthenticated || !session?.user?.id || !activeChat) return;
  //   
  //   let mounted = true;
  //   
  //   // Poll for new messages every 3 seconds
  //   const pollMessages = async () => {
  //     if (!mounted || !activeChat) return;
  //     
  //     try {
  //       const latestMessages = await ChatService.getChatMessages(activeChat, 1, 20);
  //       if (mounted && latestMessages.length > messages.length) {
  //         // Only update if we have more messages than currently displayed
  //         setMessages(latestMessages);
  //       }
  //     } catch (error) {
  //       console.error('Error polling chat messages:', error);
  //     }
  //   };
  //   
  //   // Initial poll
  //   pollMessages();
  //   
  //   // Set up interval for polling
  //   const interval = setInterval(pollMessages, 3000); // Poll every 3 seconds
  //   
  //   return () => {
  //     mounted = false;
  //     clearInterval(interval);
  //   };
  // }, [isAuthenticated, session?.user?.id, activeChat, messages.length]);

  // SMART REAL-TIME CHAT - Try SignalR, fallback to polling
  useEffect(() => {
    if (!isAuthenticated || !session?.user?.id || !activeChat) return;
    
    let mounted = true;
    let interval: NodeJS.Timeout | null = null;
    
    // Try SignalR first (silently)
    const trySignalR = async () => {
      if (!mounted) return false;
      
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7080';
        const connection = await NotificationService.startConnection(baseUrl, session.user.id, session.user.token);
        
        if (connection && mounted && connection.state === 'Connected') {
          console.log('✅ Real-time chat enabled (SignalR)');
          
          connection.on("ReceiveChatMessage", (messageData: any) => {
            console.log('🔔 SignalR message received:', messageData);
            console.log('🆔 Message chatId:', messageData.chatId, 'Active chat:', activeChat);
            
            // WORKAROUND: Compare using truncated precision due to JavaScript number limits
            const messageChatIdStr = String(messageData.chatId);
            const activeChatIdStr = String(activeChat);
            
            // Compare first 15 digits (safe precision range for JavaScript numbers)
            const messagePrefix = messageChatIdStr.substring(0, 15);
            const activePrefix = activeChatIdStr.substring(0, 15);
            const idsMatch = messagePrefix === activePrefix;
            
            console.log('🔍 Precision workaround - comparing prefixes:');
            console.log('  Message prefix:', messagePrefix);
            console.log('  Active prefix:', activePrefix);
            console.log('  Match:', idsMatch);
            
            if (mounted && idsMatch) {
              console.log('✅ Adding message to active chat');
              const newMessage: IChatMessage = {
                id: messageData.id || String(Date.now()),
                content: messageData.content,
                chatId: messageData.chatId,
                userId: messageData.userId,
                userName: messageData.userName,
                createdAt: messageData.createdAt
              };
              
              console.log('🚀 Calling setMessages with new message:', newMessage);
              setMessages(prev => {
                console.log('📝 Previous messages count:', prev.length);
                const newList = [...prev, newMessage];
                console.log('📝 New messages count:', newList.length);
                return newList;
              });
            }
          });
          
          return true; // SignalR working
        }
      } catch (error) {
        // SignalR failed silently
      }
      
      return false; // SignalR not working
    };
    
    // Fallback to smart polling
    const startPolling = () => {
      if (!mounted || !activeChat) return;
      
      console.log('📡 Real-time chat enabled (polling)');
      
      const pollMessages = async () => {
        if (!mounted || !activeChat) return;
        
        try {
          const latestMessages = await ChatService.getChatMessages(activeChat, 1, 50);
          if (mounted && latestMessages.length > messages.length) {
            setMessages(latestMessages);
          }
        } catch (error) {
          // Polling failed silently
        }
      };
      
      // Poll every 2 seconds for good responsiveness
      interval = setInterval(pollMessages, 2000);
    };
    
    // Try SignalR first, then fallback
    trySignalR().then(signalRWorking => {
      if (!signalRWorking) {
        startPolling();
      }
    });
    
    return () => {
      mounted = false;
      if (interval) {
        clearInterval(interval);
      }
      
      const connection = NotificationService.getConnection();
      if (connection) {
        try {
          connection.off("ReceiveChatMessage");
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [isAuthenticated, session?.user?.id, activeChat, messages.length]);

  // No need to join/leave chat groups - backend sends to all users in chat
  // SignalR will receive messages automatically like notifications

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    try {
      const newMessage = await ChatService.sendMessage(activeChat, {
        content: message
      });
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Note: Chat list update would need refetch or state management
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatChatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return formatTime(dateString);
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getParticipantName = (chat: IChat): string => {
    // Check if it's a direct chat (2 participants) or group chat (more than 2)
    const isDirectChat = chat.participants && chat.participants.length === 2;
    
    if (!isDirectChat) {
      // For group chats, show the chat name
      return chat.name;
    }
    
    // For direct chats, show the other participant's name
    const otherParticipant = chat.participants?.find(p => p.userId !== session?.user?.id);
    return otherParticipant?.name || chat.name;
  };

  const getParticipantImage = (chat: IChat): string | null => {
    // Check if it's a direct chat (2 participants)
    const isDirectChat = chat.participants && chat.participants.length === 2;
    
    if (!isDirectChat) return null;
    
    const otherParticipant = chat.participants?.find(p => p.userId !== session?.user?.id);
    return otherParticipant?.profileImageUrl || null;
  };


  const selectedChat = chats?.find(chat => chat.id === activeChat);

  if (!isAuthenticated) return null;

  return (
    <aside className={`fixed right-0 top-0 border-l border-slate-700/50 h-screen bg-slate-900/50 backdrop-blur-xl hidden lg:block transition-all duration-300 ${isMinimized ? 'w-16' : 'w-80'}`}>
      <div className="p-4 pt-20 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-white ${isMinimized ? 'hidden' : 'text-lg'}`}>
            Chat
          </h3>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <svg className={`w-5 h-5 transform ${isMinimized ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {!isMinimized && (
          <>
            {!activeChat ? (
              /* Chat List */
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <ChatListSkeleton count={4} />
                ) : !chats || chats.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <p className="text-sm">Nenhum chat encontrado</p>
                    <p className="text-xs mt-1">Inicie uma conversa!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {chats?.map((chat) => {
                      const participantName = getParticipantName(chat);
                      const participantImage = getParticipantImage(chat);
                      
                      return (
                        <div
                          key={chat.id}
                          onClick={() => setActiveChat(chat.id)}
                          className="flex items-center space-x-3 p-3 hover:bg-slate-800/30 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="relative">
                            <UserAvatar
                              src={participantImage}
                              alt={participantName}
                              name={participantName}
                              className="w-10 h-10"
                              fallbackClassName="bg-gradient-to-r from-blue-500 to-purple-600"
                            />
                            {/* TODO: Add online status when available from backend */}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-white truncate">{participantName}</p>
                              <span className="text-xs text-slate-500">
                                {formatChatTime(chat.lastMessageTime)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-400 truncate">
                              {chat.lastMessage || 'Nenhuma mensagem ainda'}
                            </p>
                          </div>
                          {chat.unreadCount && chat.unreadCount > 0 && (
                            <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Active Chat */
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/50 mb-4">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex items-center space-x-2">
                    {selectedChat && (
                      <>
                        <UserAvatar
                          src={getParticipantImage(selectedChat)}
                          alt={getParticipantName(selectedChat)}
                          name={getParticipantName(selectedChat)}
                          className="w-8 h-8"
                          fallbackClassName="bg-gradient-to-r from-blue-500 to-purple-600"
                        />
                        <span className="font-medium text-white">
                          {getParticipantName(selectedChat)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="w-5"></div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {messagesLoading ? (
                    <MessageSkeleton />
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <p className="text-sm">Nenhuma mensagem ainda</p>
                      <p className="text-xs mt-1">Inicie a conversa!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.userId === session?.user?.id;
                      
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-lg ${
                            isMe 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                              : 'bg-slate-800/50 text-white'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white p-2 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default RightSidebar;