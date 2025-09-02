import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IChat } from '@/types/IChat';
import { IChatMessage } from '@/types/IChatMessage';
import ChatService from '@/services/ChatService';
import { UserAvatar } from '@/components/ui/user-avatar';
import { ChatListSkeleton, MessageSkeleton } from '@/components/ui/skeletons';
import { useAppData } from '@/components/AppLoader';

const RightSidebar = () => {
  const { data: session } = useSession();
  const { chats, chatsLoading } = useAppData();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Load messages when activeChat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  // Listen for new messages from SignalR
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      console.log('🎯 RightSidebar received newChatMessage event:', event.detail);
      const { chatId, messageData } = event.detail;
      console.log('🎯 Event chatId:', chatId, 'activeChat:', activeChat);
      
      // Only update if it's for the currently active chat
      if (activeChat && chatId === activeChat) {
        console.log('🎯 Adding message to active chat!');
        setMessages(prev => {
          const updated = [...prev, messageData];
          console.log('🎯 Updated messages:', updated);
          return updated;
        });
      } else {
        console.log('🎯 Message not for active chat, ignoring');
      }
    };

    console.log('🎯 RightSidebar setting up event listener for activeChat:', activeChat);
    window.addEventListener('newChatMessage', handleNewMessage as EventListener);
    return () => window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
  }, [activeChat]);

  const loadMessages = async (chatId: string) => {
    if (!chatId) return;
    setMessagesLoading(true);
    try {
      const chatMessages = await ChatService.getChatMessages(chatId, 1, 50);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    try {
      const newMessage = await ChatService.sendMessage(activeChat, {
        content: message
      });
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
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
    const isDirectChat = chat.participants && chat.participants.length === 2;
    
    if (!isDirectChat) {
      return chat.name;
    }
    
    const otherParticipant = chat.participants?.find(p => p.userId !== session?.user?.id);
    return otherParticipant?.name || chat.name;
  };

  const getParticipantImage = (chat: IChat): string | null => {
    const isDirectChat = chat.participants && chat.participants.length === 2;
    
    if (!isDirectChat) return null;
    
    const otherParticipant = chat.participants?.find(p => p.userId !== session?.user?.id);
    return otherParticipant?.profileImageUrl || null;
  };

  const selectedChat = chats?.find(chat => chat.id === activeChat);

  if (!session?.user?.id) return null;

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
                {chatsLoading ? (
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
                        <div 
                          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            const otherParticipant = selectedChat.participants?.find(p => p.userId !== session?.user?.id);
                            if (otherParticipant?.userName) {
                              window.location.href = `/profile/${otherParticipant.userName}`;
                            }
                          }}
                        >
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
                        </div>
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
                      const isGroupChat = selectedChat && selectedChat.participants && selectedChat.participants.length > 2;
                      
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {!isMe && isGroupChat && (
                            <div className="flex items-start space-x-2">
                              <div 
                                className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  const userNameToVisit = msg.userName;
                                  if (userNameToVisit) {
                                    window.location.href = `/profile/${userNameToVisit}`;
                                  }
                                }}
                              >
                                <UserAvatar
                                  src={msg.userProfileImage || msg.userProfileImageUrl || null}
                                  alt={msg.name || msg.userName || 'Usuário'}
                                  name={msg.name || msg.userName || 'Usuário'}
                                  className="w-8 h-8"
                                  fallbackClassName="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs text-slate-400 mb-1 font-medium">
                                  {msg.name || msg.userName || 'Usuário'}
                                </span>
                                <div className="bg-slate-800/50 text-white max-w-xs px-3 py-2 rounded-lg">
                                  <p className="text-sm">{msg.content}</p>
                                  <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {(isMe || !isGroupChat) && (
                            <div className={`max-w-xs px-3 py-2 rounded-lg ${
                              isMe 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                                : 'bg-slate-800/50 text-white'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-xs opacity-70 mt-1">{formatTime(msg.createdAt)}</p>
                            </div>
                          )}
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