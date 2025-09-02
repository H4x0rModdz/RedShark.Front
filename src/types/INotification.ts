export interface INotification {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface ICreateNotificationDto {
  userId: string;
  content: string;
}

export interface IUpdateNotificationDto {
  id: string;
  isRead: boolean;
}