import { api } from "./api";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { INotification, ICreateNotificationDto, IUpdateNotificationDto } from '@/types/INotification';

const endpoint = "api/Notification";
let connection: HubConnection | null = null;
let isConnecting = false; // Global flag to prevent multiple simultaneous connections

export const NotificationService = {
  /**
   * Gets all notifications for the current user
   */
  async getAllNotifications(pageNumber: number = 1, pageSize: number = 20): Promise<INotification[]> {
    try {
      const response = await api.get(endpoint, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      throw error;
    }
  },

  /**
   * Gets a specific notification by ID
   */
  async getNotificationById(id: string): Promise<INotification> {
    try {
      const response = await api.get(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar notificação:", error);
      throw error;
    }
  },

  /**
   * Creates a new notification
   */
  async createNotification(notification: ICreateNotificationDto): Promise<INotification> {
    try {
      const response = await api.post(endpoint, notification);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw error;
    }
  },

  /**
   * Marks a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`${endpoint}/${encodeURIComponent(notificationId)}`, {
      id: notificationId,
      isRead: true,
    });
  },

  /**
   * Starts SignalR connection for real-time notifications
   */
  async startConnection(baseUrl: string, userId: string, token: string): Promise<HubConnection | null> {
    try {
      // Prevent multiple simultaneous connection attempts
      if (isConnecting) {
        console.warn("SignalR: Connection attempt already in progress, skipping");
        return null;
      }

      // If connection already exists and is connected, return it
      if (connection && connection.state === 'Connected') {
        return connection;
      }

      isConnecting = true;

      // Forcefully stop and clean up any existing connection
      if (connection) {
        try {
          console.log("Cleaning up existing connection, state:", connection.state);
          if (connection.state !== 'Disconnected') {
            await connection.stop();
          }
        } catch (error) {
          console.warn("Warning during connection cleanup:", error);
        }
        connection = null;
      }

      // Validate inputs
      if (!baseUrl || !userId || !token) {
        console.warn("SignalR: Parâmetros inválidos para conexão");
        return null;
      }

      // Check if token is expired
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (tokenData.exp && tokenData.exp < currentTime) {
          console.warn("SignalR: Token expirado, not connecting");
          return null;
        }
      } catch (error) {
        console.warn("SignalR: Não foi possível validar token:", error);
      }

      // Test if the hub URL is reachable first
      const hubUrl = `${baseUrl}/notificationHub`;
      
      connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          // Start with LongPolling for better reliability, fallback to others
          transport: HttpTransportType.LongPolling | HttpTransportType.ServerSentEvents | HttpTransportType.WebSockets,
          accessTokenFactory: () => {
            // Remove 'Bearer ' prefix if present, SignalR will add it automatically
            const cleanToken = token.replace(/^Bearer\s+/i, "");
            console.log("SignalR using token for auth (length:", cleanToken.length, ")");
            return Promise.resolve(cleanToken);
          },
          skipNegotiation: false,
          withCredentials: false, // Avoid CORS issues
        })
        .configureLogging(LogLevel.Warning) // Reduce log noise
        // Disable automatic reconnect for now to avoid multiple connection attempts
        // .withAutomaticReconnect()
        .build();

      // Handle connection events - remove reconnect handlers
      connection.onclose((error) => {
        if (error) {
          console.log("SignalR connection closed with error:", error.message);
        } else {
          console.log("SignalR connection closed");
        }
        // Don't attempt to reconnect, just clean up
        connection = null;
        isConnecting = false;
      });

      // Remove reconnect handlers to prevent automatic reconnection
      // connection.onreconnecting();
      // connection.onreconnected();

      // Start connection with timeout
      console.log("Iniciando conexão SignalR...");
      
      // Use Promise.race to add timeout - increase timeout to 15 seconds
      await Promise.race([
        connection.start(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout after 15 seconds')), 15000)
        )
      ]);

      // Double-check connection state after start
      if (!connection || connection.state !== 'Connected') {
        throw new Error(`Connection failed to establish properly. State: ${connection?.state || 'null'}`);
      }
      
      console.log("✅ Conectado ao NotificationHub, state:", connection.state);

      // Try to join user group, but don't fail if it errors
      try {
        if (connection && connection.state === 'Connected') {
          await connection.invoke("JoinUserGroup", userId);
          console.log("✅ Entrou no grupo de usuário:", userId);
        } else {
          console.warn(`Connection not in connected state (${connection?.state}), skipping user group join`);
        }
      } catch (error: any) {
        console.warn("Erro ao entrar no grupo de usuário:", error?.message);
      }

      isConnecting = false;
      return connection;
    } catch (error: any) {
      isConnecting = false;
      const errorMessage = error?.message || error;
      
      if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch resource')) {
        console.log("SignalR: Backend não disponível (NetworkError)");
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        console.log("SignalR: Token inválido ou expirado (401)");
      } else if (errorMessage.includes('WebSocket failed') || errorMessage.includes('EventSource failed')) {
        console.log("SignalR: Transporte específico falhou, tentando outros transportes");
      } else if (errorMessage.includes('HttpConnection before stop')) {
        console.log("SignalR: Conexão interrompida durante setup");
      } else {
        console.log("SignalR não disponível:", errorMessage);
      }
      
      // Clean up failed connection
      if (connection) {
        try {
          await connection.stop();
        } catch {
          // Ignore cleanup errors
        }
        connection = null;
      }
      
      return null;
    }
  },

  /**
   * Stops SignalR connection safely
   */
  async stopConnection(): Promise<void> {
    try {
      if (connection) {
        // Don't try to leave user group as it's causing issues
        await connection.stop();
        connection = null;
        console.log("Desconectado do NotificationHub");
      }
    } catch (error) {
      console.error("Erro ao desconectar do NotificationHub:", error);
      // Force cleanup even if there's an error
      connection = null;
    }
  },

  /**
   * Gets the current SignalR connection
   */
  getConnection(): HubConnection | null {
    return connection;
  }
};

export default NotificationService;

// Export individual functions for convenience
export const { startConnection, stopConnection, getConnection } = NotificationService;