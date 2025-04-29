import { createSlice, createAsyncThunk, PayloadAction, current } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  isNew?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  expiresAt: Date | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  expiresAt: null,
};

export const updateUserName = createAsyncThunk(
  'auth/updateName',
  async ({ email, name }: { email: string; name: string }) => {
    const response = await fetch('/api/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      throw new Error('Failed to update name');
    }

    return await response.json();
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ 
      user: User; 
      token: string;
      expiresAt: Date;
    }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
      console.log(current(state))
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.expiresAt = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserName.fulfilled, (state, action) => {
      if (state.user) {
        state.user.name = action.payload.name;
      }
    });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
