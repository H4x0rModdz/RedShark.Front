import { api } from "./api";
import { IPost } from "@/types/IPost";

const endpoint = "api/Feed";

export const FeedService = {
  /**
   * Recupera o feed com base nos parâmetros de cursor e tamanho da página.
   * @param cursor - (Opcional) Cursor para paginação.
   * @param pageSize - (Opcional) Tamanho da página (padrão: 10).
   * @returns Um objeto contendo os posts e o próximo cursor.
   */
  async getFeed(userId: string, cursor?: string, pageSize: number = 10): Promise<{ posts: IPost[]; nextCursor: string | null }> {
    try {
      const response = await api.get(endpoint, {
        params: { userId, cursor, pageSize },
      });
      
      
      // Otimizar transformação de dados (usar fallbacks pré-definidos)
      const DEFAULT_AVATAR = 'https://github.com/shadcn.png';
      
      const transformedData = {
        posts: response.data.posts.map((post: any) => {
          // Pre-compute repeated operations
          const userImage = post.userImage || post.UserImage || DEFAULT_AVATAR;
          const comments = post.comments ? post.comments.map((comment: any) => ({
            id: comment.id,
            userId: comment.userId || comment.UserId || '',
            name: comment.name || comment.Name || 'User',
            userName: comment.userName || comment.UserName || 'user',
            userImage: comment.userImage || comment.UserImage || DEFAULT_AVATAR,
            content: comment.content || comment.Content || '',
            createdAt: comment.createdAt || comment.CreatedAt || new Date().toISOString(),
            likesCount: comment.likesCount || comment.LikesCount || 0,
            commentsCount: comment.commentsCount || comment.CommentsCount || 0,
            isLiked: comment.isLiked || false
          })) : [];
          
          return {
            ...post,
            userImage,
            comments
          };
        }),
        nextCursor: response.data.nextCursor
      };
      
      return transformedData;
    } catch (error) {
      console.error("Erro ao buscar o feed:", error);
      throw error;
    }
  },
};

export default FeedService;
