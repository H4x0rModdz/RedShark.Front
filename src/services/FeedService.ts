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
      
      // Transformar os dados do backend para o formato esperado pelo frontend
      const transformedData = {
        posts: response.data.posts.map((post: any) => ({
          ...post,
          userImage: post.userImage || post.UserImage || 'https://github.com/shadcn.png',
          comments: (post.comments || []).map((comment: any) => ({
            id: comment.id,
            user: comment.name || 'User',
            userName: comment.userName ? `@${comment.userName}` : '@user',
            avatar: comment.userImage || 'https://github.com/shadcn.png',
            content: comment.content,
            likes: comment.likesCount || 0,
            isLiked: false // Backend não retorna esse campo ainda
          }))
        })),
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
