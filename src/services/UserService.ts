import { api } from "./api";

export interface UpdateUserData {
  name?: string;
  email?: string;
  biography?: string;
  location?: string;
  website?: string;
  profileImage?: File;
  coverImage?: File;
}

export interface UserProfileResponse {
  id: string;
  userName: string;
  name: string;
  email: string;
  biography: string;
  profileImageUrl: string;
  coverImageUrl?: string;
  location?: string;
  website?: string;
  maritalStatus?: string;
  profession?: string;
  profileMusic?: string;
  birthDate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  photos?: any[];
}

export interface UpdateUserResponse {
  success: boolean;
  errors: string[];
}

const endpoint = "api/User";

export const UserService = {
  /**
   * Gets user profile by username
   */
  async getUserProfile(username: string): Promise<UserProfileResponse> {
    try {
      const response = await api.get(`${endpoint}/profile/${username}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      throw error;
    }
  },

  /**
   * Updates user information
   */
  async updateUser(userId: string, userData: UpdateUserData): Promise<UpdateUserResponse> {
    try {
      const formData = new FormData();
      
      // Add text fields
      if (userData.name) formData.append('name', userData.name);
      if (userData.email) formData.append('email', userData.email);
      if (userData.biography) formData.append('biography', userData.biography);
      if (userData.location) formData.append('location', userData.location);
      if (userData.website) formData.append('website', userData.website);
      
      // Add file fields
      if (userData.profileImage) formData.append('profileImage', userData.profileImage);
      if (userData.coverImage) formData.append('coverImage', userData.coverImage);

      const response = await api.patch(`${endpoint}/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },

  /**
   * Updates only profile image
   */
  async updateProfileImage(userId: string, profileImage: File): Promise<UpdateUserResponse> {
    return this.updateUser(userId, { profileImage });
  },

  /**
   * Updates only cover image
   */
  async updateCoverImage(userId: string, coverImage: File): Promise<UpdateUserResponse> {
    return this.updateUser(userId, { coverImage });
  },
};

export default UserService;