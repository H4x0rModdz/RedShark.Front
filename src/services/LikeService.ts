import { api } from "./api";

export interface CreateLikeData {
  userId: string;
  postId: number;
}

export interface LikeResponse {
  success: boolean;
  errors: string[];
}

const endpoint = "api/Like";

export const LikeService = {
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
  async deleteLike(likeId: number): Promise<LikeResponse> {
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
  async getPostLikes(postId: number, pageNumber: number = 1, pageSize: number = 10) {
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