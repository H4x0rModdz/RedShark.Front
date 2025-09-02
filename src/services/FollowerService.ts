import { api } from './api';

export interface FollowerDto {
  relationshipId: string;
  profileUserId: string;
  followerId: string;
  followerDisplayName: string;
  followerUsername: string;
  followerProfileImage?: string;
  doIFollowThisPerson: boolean;
  doesThisPersonFollowMe: boolean;
}

export interface FollowingDto {
  relationshipId: string;
  profileUserId: string;
  followingId: string;
  followingDisplayName: string;
  followingUsername: string;
  followingProfileImage?: string;
  doIFollowThisPerson: boolean;
  doesThisPersonFollowMe: boolean;
}

export interface FollowersCountResponse {
  count: number;
}

export interface FollowingCountResponse {
  count: number;
}

class FollowerService {
  /**
   * Obtém lista paginada de seguidores de um usuário
   */
  async getFollowers(userId: string | string, pageNumber: number = 1, pageSize: number = 10): Promise<FollowerDto[]> {
    try {
      const response = await api.get(`/api/Follower/${userId}/followers`, {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar seguidores:', error);
      throw error;
    }
  }

  /**
   * Obtém lista paginada de usuários que um usuário está seguindo
   */
  async getFollowing(userId: string | string, pageNumber: number = 1, pageSize: number = 10): Promise<FollowingDto[]> {
    try {
      const response = await api.get(`/api/Follower/${userId}/following`, {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar seguidos:', error);
      throw error;
    }
  }

  /**
   * Obtém contagem de seguidores de um usuário
   */
  async getFollowersCount(userId: string | string): Promise<number> {
    try {
      const response = await api.get(`/api/Follower/${userId}/followers/count`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contagem de seguidores:', error);
      throw error;
    }
  }

  /**
   * Obtém contagem de usuários que um usuário está seguindo
   */
  async getFollowingCount(userId: string | string): Promise<number> {
    try {
      const response = await api.get(`/api/Follower/${userId}/following/count`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contagem de seguidos:', error);
      throw error;
    }
  }

  /**
   * Segue um usuário
   */
  async followUser(userId: string | string): Promise<boolean> {
    try {
      const response = await api.post(`/api/Follower/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
      throw error;
    }
  }

  /**
   * Para de seguir um usuário
   */
  async unfollowUser(userId: string | string): Promise<boolean> {
    try {
      const response = await api.delete(`/api/Follower/${userId}/unfollow`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
      throw error;
    }
  }

  /**
   * Alterna o estado de seguir/não seguir um usuário
   */
  async toggleFollow(userId: string | string, isCurrentlyFollowing: boolean): Promise<boolean> {
    if (isCurrentlyFollowing) {
      return await this.unfollowUser(userId);
    } else {
      return await this.followUser(userId);
    }
  }
}

export default new FollowerService();