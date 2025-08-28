import { api } from "./api";
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

interface INotification {
  id: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  userId: number;
}

interface CreateNotificationDto {
  userId: number;
  content: string;
}

interface UpdateNotificationDto {
  id: number;
  isRead: boolean;
}

const endpoint = "api/Notification";
let connection: HubConnection | null = null;

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
  async getNotificationById(id: number): Promise<INotification> {
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
  async createNotification(notification: CreateNotificationDto): Promise<INotification> {
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
  async markAsRead(notificationId: number): Promise<INotification> {
    try {
      const updateData: UpdateNotificationDto = {
        id: notificationId,
        isRead: true
      };
      const response = await api.put(endpoint, updateData);
      return response.data;
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      throw error;
    }
  },

  /**
   * Starts SignalR connection for real-time notifications
   */
  async startConnection(baseUrl: string, userId: string, token: string): Promise<HubConnection | null> {
    try {
      // If connection already exists and is connected, return it
      if (connection && connection.state === 'Connected') {
        return connection;
      }

      // Stop any existing connection first
      if (connection) {
        try {
          await connection.stop();
        } catch {
          // Ignore errors when stopping
        }
        connection = null;
      }

      // Validate inputs
      if (!baseUrl || !userId || !token) {
        console.warn("SignalR: Parâmetros inválidos para conexão");
        return null;
      }

      // Test if the hub URL is reachable first
      const hubUrl = `${baseUrl}/notificationHub`;
      
      connection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          transport: HttpTransportType.WebSockets,
          accessTokenFactory: () => Promise.resolve(token.replace(/^Bearer\\s+/i, "")),
          skipNegotiation: false,
        })
        .configureLogging(LogLevel.Error) // Only show errors
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            // Exponential backoff with maximum delay
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
        })
        .build();

      // Handle connection events
      connection.onclose((error) => {
        if (error) {
          console.log("SignalR connection closed with error:", error.message);
        } else {
          console.log("SignalR connection closed");
        }
      });

      connection.onreconnecting((error) => {
        console.log("SignalR reconnecting...", error?.message);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected:", connectionId);
        // Rejoin user group after reconnection
        if (connection) {
          connection.invoke("JoinUserGroup", userId).catch((error) => {
            console.warn("Erro ao reentrar no grupo após reconexão:", error?.message);
          });
        }
      });

      // Start connection with timeout
      const startPromise = connection.start();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timeout")), 10000); // 10 second timeout
      });

      await Promise.race([startPromise, timeoutPromise]);
      console.log("Conectado ao NotificationHub");

      // Try to join user group, but don't fail if it errors
      try {
        await connection.invoke("JoinUserGroup", userId);
        console.log("Entrou no grupo de usuário:", userId);
      } catch (error: any) {
        console.warn("Erro ao entrar no grupo de usuário:", error?.message);
        // Don't fail completely if group join fails
      }

      return connection;
    } catch (error: any) {
      console.log("SignalR não disponível:", error?.message || error);
      
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