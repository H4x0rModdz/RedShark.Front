export interface IComment {
    id: number;
    user: string;
    userName: string;
    avatar: string;
    likes: number;
    isLiked: boolean;
    content: string;
  }