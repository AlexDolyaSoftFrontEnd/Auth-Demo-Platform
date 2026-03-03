// src/types/auth.types.ts

export interface ILoginValues {
    email: string;
  }
  
  export interface IUser {
    email: string;
    name: string;
  }
  
  export interface IAuthState {
    user: IUser | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
  }
