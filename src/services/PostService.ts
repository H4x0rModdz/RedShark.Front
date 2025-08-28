import { api } from "./api";
import { IPost } from "@/types/IPost";

export interface CreatePostData {
  content: string;
  userId: string;
  images?: File[];
}

export interface UpdatePostData {
  postId: number;
  content: string;
  imagesToKeep?: number[];
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
  async deletePost(postId: number): Promise<PostResponse> {
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
  async getAllPosts(pageNumber: number = 1, pageSize: number = 10): Promise<IPost[]> {
    try {
      const response = await api.get(endpoint, {
        params: { pageNumber, pageSize },
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
  async getPostById(postId: number): Promise<IPost> {
    try {
      const response = await api.get(`${endpoint}/${postId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar post:", error);
      throw error;
    }
  },
};

export default PostService;