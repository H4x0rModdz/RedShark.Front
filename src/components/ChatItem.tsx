import React from 'react';
import { IChat } from '@/types/IChat';
import { UserAvatar } from '@/components/ui/user-avatar';

interface ChatItemProps {
  chat: IChat;
  currentUserId?: string;
  onClick: (chatId: string) => void;
  formatTime: (dateString?: string) => string;
}

const ChatItem: React.FC<ChatItemProps> = React.memo(({
  chat,
  currentUserId,
  onClick,
  formatTime
}) => {
  // Check if it's a direct chat (2 participants) or group chat (more than 2)
  const isDirectChat = chat.participants && chat.participants.length === 2;
  
  const getParticipantName = (): string => {
    if (!isDirectChat) {
      return chat.name;
    }
    
    const otherParticipant = chat.participants?.find(p => p.userId !== currentUserId);
    return otherParticipant?.name || chat.name;
  };

  const getParticipantImage = (): string => {
    if (!isDirectChat) {
      return 'https://github.com/shadcn.png'; // Default group image
    }
    
    const otherParticipant = chat.participants?.find(p => p.userId !== currentUserId);
    return otherParticipant?.profileImageUrl || 'https://github.com/shadcn.png';
  };

  const participantName = getParticipantName();
  const participantImage = getParticipantImage();

  return (
    <div
      onClick={() => onClick(chat.id)}
      className="flex items-center space-x-3 p-3 hover:bg-slate-800/30 rounded-lg cursor-pointer transition-colors"
    >
      <div className="relative">
        <UserAvatar
          src={participantImage}
          alt={participantName}
          name={participantName}
          className="w-10 h-10"
          fallbackClassName="bg-gradient-to-r from-blue-500 to-purple-600"
        />
        {/* TODO: Add online status when available from backend */}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-white truncate">{participantName}</p>
          <span className="text-xs text-slate-500">
            {formatTime(chat.lastMessageTime)}
          </span>
        </div>
        <p className="text-sm text-slate-400 truncate">
          {chat.lastMessage || 'Nenhuma mensagem ainda'}
        </p>
      </div>
      {chat.unreadCount && chat.unreadCount > 0 && (
        <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
        </div>
      )}
    </div>
  );
});

ChatItem.displayName = 'ChatItem';

export default ChatItem;