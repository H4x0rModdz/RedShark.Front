"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// Using simple icons instead of heroicons
import NotificationService from '@/services/NotificationService';
import ConnectionStatus from '@/components/ConnectionStatus';
import { INotification } from '@/types/INotification';

const Notifications: React.FC = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRealTime, setIsRealTime] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const fetchNotifications = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const data = await NotificationService.getAllNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(
        unreadNotifications.map(n => NotificationService.markAsRead(n.id))
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    fetchNotifications();
    
    // Only attempt SignalR in production or when explicitly enabled
    const enableRealTime = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_SIGNALR === 'true';
    
    if (!enableRealTime) {
      console.log("SignalR desabilitado - usando polling para notificações");
      setIsRealTime(false);
      setIsConnected(false);
      
      // Set up polling as fallback
      const interval = setInterval(() => {
        if (session?.user?.id) {
          fetchNotifications();
        }
      }, 30000); // Poll every 30 seconds
      
      return () => clearInterval(interval);
    }
    
    // Start SignalR connection for real-time notifications
    let connection: any = null;
    let mounted = true;
    
    const startSignalRConnection = async () => {
      if (!session?.user?.id || !mounted) return;
      
      // Check if backend is available first
      try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Test if the hub endpoint exists
        const response = await fetch(`${baseUrl}/api/health`, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        }).catch(() => null);
        
        if (!response || !response.ok) {
          console.log("Backend não disponível - usando polling para notificações");
          setIsRealTime(false);
          setIsConnected(false);
          
          // Fallback to polling
          const interval = setInterval(() => {
            if (session?.user?.id && mounted) {
              fetchNotifications();
            }
          }, 30000);
          
          return () => clearInterval(interval);
        }
        
        connection = await NotificationService.startConnection(
          baseUrl,
          session.user.id,
          session.user.token || ''
        );
        
        if (connection && mounted) {
          setIsRealTime(true);
          setIsConnected(true);
          
          connection.on("ReceiveNotification", (message: string) => {
            console.log("Nova notificação recebida:", message);
            // Refresh notifications when new one arrives
            if (mounted) {
              fetchNotifications();
            }
          });
        } else {
          setIsRealTime(false);
          setIsConnected(false);
        }
      } catch (error) {
        console.log("SignalR não disponível - usando polling:", error);
        setIsRealTime(false);
        setIsConnected(false);
        
        // Fallback to polling
        if (mounted) {
          const interval = setInterval(() => {
            if (session?.user?.id && mounted) {
              fetchNotifications();
            }
          }, 30000);
          
          return () => clearInterval(interval);
        }
      }
    };
    
    startSignalRConnection();
    
    // Cleanup function
    return () => {
      mounted = false;
      if (connection) {
        try {
          connection.off("ReceiveNotification");
          connection.stop().catch(() => {
            // Ignore errors on cleanup
          });
        } catch (error) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [session]);

  if (!session) return null;

  return (
    <>
      <ConnectionStatus isRealTime={isRealTime} isConnected={isConnected} />
      <div className="relative">
        <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="relative p-2 text-gray-300 hover:text-white"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5v10L5 12l10-5v10zM10.268 21A2 2 0 1012.732 21M15 17H9a2 2 0 01-2-2V9a4 4 0 118 0v6a2 2 0 01-2 2z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-gray-800 border-gray-700 z-50">
            <CardContent className="p-0">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
                <h3 className="font-semibold text-white">Notificações</h3>
                <div className="flex space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      onClick={markAllAsRead}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-1"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-gray-700">
                {loading ? (
                  <div className="p-4 text-center text-gray-400">
                    Carregando...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    Nenhuma notificação
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-gray-750 transition-colors ${
                        !notification.isRead ? 'bg-gray-750 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => !notification.isRead && markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-sm ${
                            !notification.isRead ? 'text-white font-medium' : 'text-gray-300'
                          }`}>
                            {notification.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </>
  );
};

export default Notifications;