import { api } from "./api";
import { IComment } from "@/types/IComment";

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

const endpoint = "api/Comment";

export const CommentService = {
  /**
   * Creates a new comment
   */
  async createComment(request: CreateCommentRequest): Promise<IComment> {
    try {
      const response = await api.post(endpoint, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar comentário:", error);
      throw error;
    }
  },

  /**
   * Gets a specific comment by ID
   */
  async getCommentById(commentId: string): Promise<IComment> {
    try {
      const response = await api.get(`${endpoint}/${commentId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar comentário:", error);
      throw error;
    }
  },

  /**
   * Gets comments for a specific post
   */
  async getCommentsByPost(
    postId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<IComment[]> {
    try {
      const response = await api.get(`${endpoint}/post/${postId}`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar comentários do post:", error);
      throw error;
    }
  },

  /**
   * Gets replies to a specific comment
   */
  async getCommentReplies(
    commentId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<IComment[]> {
    try {
      const response = await api.get(`${endpoint}/${commentId}/replies`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar respostas do comentário:", error);
      throw error;
    }
  },

  /**
   * Updates an existing comment
   */
  async updateComment(commentId: string, request: UpdateCommentRequest): Promise<IComment> {
    try {
      const response = await api.put(`${endpoint}/${commentId}`, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
      throw error;
    }
  },

  /**
   * Deletes a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    try {
      await api.delete(`${endpoint}/${commentId}`);
    } catch (error) {
      console.error("Erro ao deletar comentário:", error);
      throw error;
    }
  },

  /**
   * Gets all comments with optional filters
   */
  async getAllComments(
    postId?: string,
    userId?: string,
    status?: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<IComment[]> {
    try {
      const response = await api.get(endpoint, {
        params: { postId, userId, status, pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
      throw error;
    }
  },
};

export default CommentService;