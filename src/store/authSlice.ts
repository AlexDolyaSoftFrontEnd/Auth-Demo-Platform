// src/store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState, IUser, ILoginValues } from '../types/auth.types';

const loginApi = async (values: ILoginValues): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (values.email.includes('@welthungerhilfe.de')) {
        resolve({ email: values.email, name: values.email.split('@')[0] });
      } else {
        reject(new Error('Неверный домен почты'));
      }
    }, 1000);
  });
};

export const loginThunk = createAsyncThunk<IUser, ILoginValues>(
  'auth/login',
  async (values, { rejectWithValue }) => {
    try {
      const user = await loginApi(values);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: IAuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
