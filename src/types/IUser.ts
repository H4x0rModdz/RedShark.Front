export enum IUserStatus {
    // Active = 1, Inactive = 2, Deleted = 3,
}

export interface IUser {
    id: string,
    name: string,
    email: string,
    biography: string,
    profileImageUrl: string,
    status: IUserStatus
    createdAt: string,
    updatedAt: string    
  }

export interface ILoginRequest {
    email: string,
    password: string,
  }

export interface ILoginResponse {
    success: boolean,
    token: string,
    errors: [],
}