import { api } from "./api";
import { IUserPhoto, CreateUserPhotoRequest, UpdateUserPhotoRequest } from "@/types/IUserPhoto";

const endpoint = "api/User";

export const UserPhotoService = {
  /**
   * Gets all photos for a specific user
   */
  async getUserPhotos(userId: string | string): Promise<IUserPhoto[]> {
    try {
      const response = await api.get(`${endpoint}/${userId}/photos`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fotos do usuário:", error);
      throw error;
    }
  },

  /**
   * Gets a specific photo by ID
   */
  async getPhotoById(photoId: string): Promise<IUserPhoto> {
    try {
      const response = await api.get(`${endpoint}/photos/${photoId}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar foto:", error);
      throw error;
    }
  },

  /**
   * Creates a new user photo
   */
  async createPhoto(userId: string, request: CreateUserPhotoRequest): Promise<IUserPhoto> {
    try {
      const response = await api.post(`${endpoint}/${userId}/photos`, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar foto:", error);
      throw error;
    }
  },

  /**
   * Updates an existing photo
   */
  async updatePhoto(photoId: string, request: UpdateUserPhotoRequest): Promise<IUserPhoto> {
    try {
      const response = await api.put(`${endpoint}/photos/${photoId}`, request);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar foto:", error);
      throw error;
    }
  },

  /**
   * Deletes a photo
   */
  async deletePhoto(photoId: string): Promise<void> {
    try {
      await api.delete(`${endpoint}/photos/${photoId}`);
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
      throw error;
    }
  },

};

export default UserPhotoService;