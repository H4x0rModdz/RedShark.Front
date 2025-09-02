import { api } from "./api";
import { IPost } from "@/types/IPost";

export interface CreatePostData {
  content: string;
  userId: string;
  images?: File[];
}

export interface UpdatePostData {
  postId: string;
  content: string;
  imagesToKeep?: string[];
  newImages?: File[];
}

export interface PostResponse {
  success: boolean;
  postId: string;
  errors: string[];
}

const endpoint = "api/Post";

export const PostService = {
  /**
   * Creates a new post
   */
  async createPost(postData: CreatePostData): Promise<PostResponse> {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      formData.append('userId', postData.userId);
      
      if (postData.images) {
        postData.images.forEach((image, index) => {
          formData.append('images', image);
        });
      }

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao criar post:", error);
      throw error;
    }
  },

  /**
   * Updates an existing post
   */
  async updatePost(postData: UpdatePostData): Promise<PostResponse> {
    try {
      const formData = new FormData();
      formData.append('postId', postData.postId.toString());
      formData.append('content', postData.content);
      
      if (postData.imagesToKeep) {
        postData.imagesToKeep.forEach(imageId => {
          formData.append('imagesToKeep', imageId.toString());
        });
      }
      
      if (postData.newImages) {
        postData.newImages.forEach((image) => {
          formData.append('newImages', image);
        });
      }

      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
      throw error;
    }
  },

  /**
   * Deletes a post
   */
  async deletePost(postId: string): Promise<PostResponse> {
    try {
      const response = await api.delete(`${endpoint}/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      throw error;
    }
  },

  /**
   * Gets all posts with pagination
   */
  async getAllPosts(pageNumber: number = 1, pageSize: number = 10, currentUserId?: string): Promise<IPost[]> {
    try {
      const params: any = { pageNumber, pageSize };
      if (currentUserId) {
        params.currentUserId = currentUserId;
      }
      
      const response = await api.get(endpoint, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      throw error;
    }
  },

  /**
   * Gets a specific post by ID
   */
  async getPostById(postId: string): Promise<IPost> {
    try {
      const response = await api.get(`${endpoint}/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar post:", error);
      throw error;
    }
  },

  /**
   * Gets posts by user ID with pagination
   */
  async getPostsByUserId(userId: string, pageNumber: number = 1, pageSize: number = 10): Promise<IPost[]> {
    try {
      const response = await api.get(`${endpoint}/user/${userId}`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar posts do usuário:", error);
      throw error;
    }
  },

  /**
   * Gets posts count by user ID
   */
  async getPostsCountByUserId(userId: string): Promise<number> {
    try {
      const response = await api.get(`${endpoint}/user/${userId}/count`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar contagem de posts:", error);
      throw error;
    }
  },

  /**
   * Gets posts with lazy loading for modal
   */
  async getPostsWithLazyLoading(userId: string, currentPage: number = 1, pageSize: number = 10) {
    try {
      const [posts, totalCount] = await Promise.all([
        this.getPostsByUserId(userId, currentPage, pageSize),
        this.getPostsCountByUserId(userId)
      ]);

      const hasMore = (currentPage * pageSize) < totalCount;

      return {
        posts,
        hasMore,
        totalCount,
        currentPage,
        loadMore: () => this.getPostsByUserId(userId, currentPage + 1, pageSize)
      };
    } catch (error) {
      console.error("Erro ao carregar posts com lazy loading:", error);
      throw error;
    }
  },
};

export default PostService;