export interface IComment {
    id: string;
    userId: string;
    name: string;
    userName: string;
    userImage: string;
    content: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
  }