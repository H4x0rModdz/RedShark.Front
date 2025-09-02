import { IChatMessage } from './IChatMessage';

export interface IChat {
    id: string;
    name: string;
    participants?: IParticipant[];
    messages?: IChatMessage[];
    createdAt: string;
    updatedAt: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isGroupChat?: boolean;
}

export interface IParticipant {
    id: string;
    userId: string;
    chatId: string;
    userName: string;
    name: string;
    profileImageUrl?: string;
    chatName: string;
}