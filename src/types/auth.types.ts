// src/types/auth.types.ts
export interface ILoginValues {
  email: string;
  password?: string; // Опционально, если используется SSO
}

export interface IUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}