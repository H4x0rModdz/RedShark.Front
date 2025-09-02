import { api } from "./api";

export interface CreateLikeData {
  userId: string;
  postId?: string;
  commentId?: string;
}

export interface LikeResponse {
  success: boolean;
  likeId?: string;
  isLiked: boolean;
  likesCount: number;
  errors: string[];
}

const endpoint = "api/Like";

export const LikeService = {
  /**
   * Toggles a like (like/unlike a post)
   */
  async toggleLike(likeData: CreateLikeData): Promise<LikeResponse> {
    try {
      const response = await api.post(`${endpoint}/toggle`, likeData);
      return response.data;
    } catch (error) {
      console.error("Erro ao alternar like:", error);
      throw error;
    }
  },

  /**
   * Toggles a like on a comment
   */
  async toggleCommentLike(likeData: CreateLikeData): Promise<LikeResponse> {
    try {
      const response = await api.post(`${endpoint}/toggle`, likeData);
      return response.data;
    } catch (error) {
      console.error("Erro ao alternar like no comentário:", error);
      throw error;
    }
  },

  /**
   * Checks if user has liked a post
   */
  async checkLike(userId: string, postId: string): Promise<any> {
    try {
      const response = await api.get(`${endpoint}/user/${userId}/post/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao verificar like:", error);
      return null;
    }
  },

  /**
   * Creates a like (like a post)
   */
  async createLike(likeData: CreateLikeData): Promise<LikeResponse> {
    try {
      const response = await api.post(endpoint, likeData);
      return response.data;
    } catch (error) {
      console.error("Erro ao curtir post:", error);
      throw error;
    }
  },

  /**
   * Deletes a like (unlike a post)
   */
  async deleteLike(likeId: string): Promise<LikeResponse> {
    try {
      const response = await api.delete(`${endpoint}/${likeId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao descurtir post:", error);
      throw error;
    }
  },

  /**
   * Gets likes for a specific post
   */
  async getPostLikes(postId: string, pageNumber: number = 1, pageSize: number = 10) {
    try {
      const response = await api.get(endpoint, {
        params: { postId, pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar likes:", error);
      throw error;
    }
  },
};

export default LikeService;