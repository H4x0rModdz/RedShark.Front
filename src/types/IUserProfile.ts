import { MaritalStatus } from './IUser';

export interface UserProfile {
  id: string;
  name: string;
  userName: string;
  email: string;
  profileImageUrl: string;
  coverImageUrl?: string;
  bio?: string;
  location?: string;
  website?: string;
  profession?: string;
  birthDate?: string;
  maritalStatus?: MaritalStatus;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isOwnProfile?: boolean;
  isVerified?: boolean;
  profileMusic?: string;
}