import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";

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
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
