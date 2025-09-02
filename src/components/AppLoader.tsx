"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FeedService from '@/services/FeedService';
import ChatService from '@/services/ChatService';
import NotificationService from '@/services/NotificationService';
import { IPost } from '@/types/IPost';
import { IChat } from '@/types/IChat';
import { INotification } from '@/types/INotification';

interface AppData {
  feed: { posts: IPost[]; nextCursor: string | null } | null;
  chats: IChat[] | null;
  notifications: INotification[] | null;
  feedLoading: boolean;
  chatsLoading: boolean;
  notificationsLoading: boolean;
  signalRConnected: boolean;
}

interface AppActions {
  loadFeed: (cursor?: string) => Promise<void>;
  loadChats: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  addMessage: (chatId: string, message: any) => void;
  addNotification: (notification: INotification) => void;
}

const AppContext = createContext<AppData & AppActions>({
  feed: null,
  chats: null,
  notifications: null,
  feedLoading: false,
  chatsLoading: false,
  notificationsLoading: false,
  signalRConnected: false,
  loadFeed: async () => {},
  loadChats: async () => {},
  loadNotifications: async () => {},
  addMessage: () => {},
  addNotification: () => {},
});

export const useAppData = () => useContext(AppContext);

interface AppLoaderProps {
  children: React.ReactNode;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const { data: session } = useSession();
  
  // Data states
  const [feed, setFeed] = useState<{ posts: IPost[]; nextCursor: string | null } | null>(null);
  const [chats, setChats] = useState<IChat[] | null>(null);
  const [notifications, setNotifications] = useState<INotification[] | null>(null);
  
  // Loading states
  const [feedLoading, setFeedLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  
  // Connection state
  const [signalRConnected, setSignalRConnected] = useState(false);
  const [signalRConnecting, setSignalRConnecting] = useState(false);

  // PRIORITY LOADING: Feed → Chat → Notifications → SignalR
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isLoadingSequentially, setIsLoadingSequentially] = useState(false);
  
  useEffect(() => {
    if (session?.user?.id && !hasInitialized && !isLoadingSequentially) {
      setHasInitialized(true);
      setIsLoadingSequentially(true);
      loadDataSequentially();
    }
  }, [session?.user?.id, hasInitialized, isLoadingSequentially]);

  const loadDataSequentially = async () => {
    if (!session?.user?.id || isLoadingSequentially) return;

    try {
      // 1. Load Feed First (highest priority)
      console.log('🚀 Loading Feed...');
      await loadFeed();
      
      // 2. Load Chats Second
      console.log('💬 Loading Chats...');
      await loadChats();
      
      // 3. Load Notifications Third
      console.log('🔔 Loading Notifications...');
      await loadNotifications();
      
      // 4. Setup SignalR Last (lowest priority)
      console.log('📡 Setting up SignalR...');
      await setupSignalR();
      
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('❌ Error in sequential loading:', error);
    } finally {
      setIsLoadingSequentially(false);
    }
  };

  const loadFeed = async (cursor?: string) => {
    if (!session?.user?.id || feedLoading) return;
    
    setFeedLoading(true);
    try {
      const result = await FeedService.getFeed(session.user.id, cursor);
      
      if (cursor) {
        // Pagination - append posts
        setFeed(prev => ({
          posts: prev ? [...prev.posts, ...result.posts] : result.posts,
          nextCursor: result.nextCursor
        }));
      } else {
        // Initial load - replace posts
        setFeed(result);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setFeedLoading(false);
    }
  };

  const loadChats = async () => {
    if (!session?.user?.id || chatsLoading) return;
    
    setChatsLoading(true);
    try {
      const userChats = await ChatService.getUserChats();
      setChats(userChats);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setChatsLoading(false);
    }
  };

  const loadNotifications = async () => {
    if (!session?.user?.id || notificationsLoading) return;
    
    setNotificationsLoading(true);
    try {
      const userNotifications = await NotificationService.getAllNotifications();
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const setupSignalR = async () => {
    if (!session?.user?.id || signalRConnected || signalRConnecting) return;
    
    
    setSignalRConnecting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_URL || 'https://localhost:7080';
      const token = session.user.token || '';
      
      if (!token) {
        console.warn('SignalR: No token available for authentication');
        return;
      }
      
      console.log('SignalR: Attempting connection with userId:', session.user.id);
      const connection = await NotificationService.startConnection(
        baseUrl,
        session.user.id,
        token
      );
      
      if (connection && connection.state === 'Connected') {
        setSignalRConnected(true);
        console.log('✅ SignalR connected');
        
        // Remove any existing handlers to prevent duplicates
        connection.off("ReceiveNotification");
        
        // Handle notifications - Use the returned connection directly, not the module-level one
        console.log('🔧 Registering ReceiveNotification event handler...');
        connection.on("ReceiveNotification", (message: string) => {
          console.log('🔔 New notification via SignalR:', message);
          // Don't reload all notifications, just show the new one
          // loadNotifications(); // Removed to prevent loading spinner
        });
        console.log('✅ ReceiveNotification handler registered');
        
        // Remove any existing chat handlers to prevent duplicates  
        connection.off("ReceiveChatMessage");
        
        // Handle chat messages - Use the returned connection directly, not the module-level one
        connection.on("ReceiveChatMessage", (messageData: any) => {
          try {
            console.log('💬 New message via SignalR:', messageData);
            console.log('💬 ChatId from message:', messageData.ChatId);
            console.log('💬 Calling addMessage with:', messageData.ChatId, messageData);
            addMessage(messageData.ChatId, messageData);
            console.log('💬 addMessage completed successfully');
          } catch (error) {
            console.error('💬 ERROR in ReceiveChatMessage handler:', error);
          }
        });
      } else if (connection) {
        console.log('SignalR connection exists but not connected:', connection.state);
      }
    } catch (error: any) {
      console.log('SignalR setup failed:', error?.message || error);
      setSignalRConnected(false);
      
      // If it's an auth error, don't retry automatically
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized') || 
          error?.message?.includes('HttpConnection') || error?.message?.includes('Failed to start')) {
        console.log('SignalR connection failed - backend may be unavailable');
      }
    } finally {
      setSignalRConnecting(false);
    }
  };

  const addMessage = (chatId: string, messageData: any) => {
    console.log('🔧 addMessage called with chatId:', chatId, 'messageData:', messageData);
    
    // Update chats with new message (using PascalCase from SignalR DTO)
    setChats(prev => {
      if (!prev) return prev;
      const updated = prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: messageData.Content, lastMessageTime: messageData.CreatedAt }
          : chat
      );
      console.log('🔧 Updated chats:', updated);
      return updated;
    });

    // Convert PascalCase DTO to camelCase for frontend compatibility
    const frontendMessage = {
      id: messageData.Id,
      content: messageData.Content,
      chatId: messageData.ChatId,
      userId: messageData.UserId,
      name: messageData.Name,
      userName: messageData.UserName,
      userProfileImage: messageData.UserProfileImage,
      createdAt: messageData.CreatedAt
    };

    // Trigger custom event for RightSidebar to listen
    console.log('🔧 Dispatching newChatMessage event for chatId:', chatId);
    window.dispatchEvent(new CustomEvent('newChatMessage', { 
      detail: { chatId, messageData: frontendMessage } 
    }));
  };

  const addNotification = (notification: INotification) => {
    setNotifications(prev => {
      if (!prev) return [notification];
      return [notification, ...prev];
    });
  };

  const contextValue: AppData & AppActions = {
    feed,
    chats,
    notifications,
    feedLoading,
    chatsLoading,
    notificationsLoading,
    signalRConnected,
    loadFeed,
    loadChats,
    loadNotifications,
    addMessage,
    addNotification,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};