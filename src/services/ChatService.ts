import { api } from "./api";
import { IChat } from "@/types/IChat";
import { IChatMessage } from "@/types/IChatMessage";

export interface CreateChatRequest {
  name: string;
}

export interface CreatePrivateChatRequest {
  otherUserId: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface AddUserToChatRequest {
  userId: string;
}

const endpoint = "api/Chat";

export const ChatService = {
  /**
   * Creates a new chat
   */
  async createChat(request: CreateChatRequest): Promise<IChat> {
    try {
      const response = await api.post(endpoint, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar chat:", error);
      throw error;
    }
  },

  /**
   * Gets a specific chat by ID
   */
  async getChatById(chatId: string): Promise<IChat> {
    try {
      const response = await api.get(`${endpoint}/${chatId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar chat:", error);
      throw error;
    }
  },

  /**
   * Gets all user chats
   */
  async getUserChats(): Promise<IChat[]> {
    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar chats do usuário:", error);
      throw error;
    }
  },

  /**
   * Gets or creates a private chat between two users
   */
  async getOrCreatePrivateChat(request: CreatePrivateChatRequest): Promise<IChat> {
    try {
      const response = await api.post(`${endpoint}/private`, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar/buscar chat privado:", error);
      throw error;
    }
  },

  /**
   * Sends a message to a chat
   */
  async sendMessage(chatId: string, request: SendMessageRequest): Promise<IChatMessage> {
    try {
      const response = await api.post(`${endpoint}/${chatId}/messages`, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      throw error;
    }
  },

  /**
   * Gets messages from a chat
   */
  async getChatMessages(
    chatId: string,
    pageNumber: number = 1,
    pageSize: number = 50
  ): Promise<IChatMessage[]> {
    try {
      const response = await api.get(`${endpoint}/${chatId}/messages`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      throw error;
    }
  },

  /**
   * Adds a user to a chat
   */
  async addUserToChat(chatId: string, request: AddUserToChatRequest): Promise<void> {
    try {
      await api.post(`${endpoint}/${chatId}/participants`, request);
    } catch (error) {
      console.error("Erro ao adicionar usuário ao chat:", error);
      throw error;
    }
  },

  /**
   * Removes a user from a chat
   */
  async removeUserFromChat(chatId: string, participantUserId: string): Promise<void> {
    try {
      await api.delete(`${endpoint}/${chatId}/participants/${participantUserId}`);
    } catch (error) {
      console.error("Erro ao remover usuário do chat:", error);
      throw error;
    }
  },
};

export default ChatService;