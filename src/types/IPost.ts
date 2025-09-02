import { IComment } from './IComment';
import { IPostImage } from './IPostImage';

export interface IPost {
    id: string;
    userId: string;
    name: string;
    userName: string;
    userImage: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    images?: IPostImage[];
    likesCount: number;
    commentsCount: number;
    comments?: IComment[];
    isFollowing: boolean;
    isLiked?: boolean;
  }
  