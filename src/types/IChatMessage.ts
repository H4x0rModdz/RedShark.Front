export interface IChatMessage {
    id: string;
    content: string;
    chatId: string;
    userId: string;
    userName?: string;
    userProfileImageUrl?: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        name: string;
        userName: string;
        profileImageUrl?: string;
    };
}