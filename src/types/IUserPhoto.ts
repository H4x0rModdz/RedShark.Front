export interface IUserPhoto {
  id: string;
  imageUrl: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPhotoRequest {
  imageUrl: string;
  description?: string;
}

export interface UpdateUserPhotoRequest {
  imageUrl?: string;
  description?: string;
}