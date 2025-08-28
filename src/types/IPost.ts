import { IComment } from './IComment';
import { IPostImage } from './IPostImage';

export interface IPost {
    id: number;
    userId?: number;
    name: string;
    userName: string;
    userImage: string;
    content: string;
    images?: IPostImage[];
    likes?: number;
    comments?: IComment[];
    isFollowing: boolean;
  }
  