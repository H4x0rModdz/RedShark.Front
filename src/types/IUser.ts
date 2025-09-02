export enum IUserStatus {
    // Active = 1, Inactive = 2, Deleted = 3,
}

export enum MaritalStatus {
    Single = 'Single',
    Married = 'Married',
    InARelationship = 'InARelationship',
    Divorced = 'Divorced',
    Widowed = 'Widowed',
    Complicated = 'Complicated'
}

export interface IUser {
    id: string,
    name: string,
    userName: string,
    email: string,
    biography: string,
    profileImageUrl: string,
    coverImageUrl?: string,
    location?: string,
    website?: string,
    profession?: string,
    birthDate?: string,
    maritalStatus?: MaritalStatus,
    profileMusic?: string,
    isVerified?: boolean,
    status: IUserStatus
    createdAt: string,
    updatedAt: string    
  }

export interface ILoginRequest {
    email: string,
    password: string,
  }

export interface ILoginResponse {
    id: string,
    name: string,
    userName: string,
    email: string,
    biography: string,
    profileImageUrl: string,
    success: boolean,
    token: string,
    errors: [],
}

export interface IRegisterRequest {
    userName: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    state: string;
    city: string;
    dateOfBirth: string;
    maritalStatus: string;
    biography: string;
    profileImage: File | null;
}

export interface IRegisterResponse {
    success: boolean;
    errors: string[];
    message?: string;
}