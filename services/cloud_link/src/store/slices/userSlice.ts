import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  teamMembers: TeamMember[];
}

interface Individual {
  id: string;
  mobile?: string;
  role?: string;
}

interface Onboarding {
  userType: 'INDIVIDUAL' | 'COMPANY';
  completed: boolean;
  individual: Individual | null;
  company: Company | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isNew: boolean;
  onboarding: Onboarding | null;
}

interface Session {
  token: string;
  expires: Date;
}

interface UserState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk to fetch user session
export const fetchUserSession = createAsyncThunk(
  'user/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/account/api/session');
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch session');
      }
      
      return await response.json();
    } catch (error: unknown) {
      console.error('Failed to fetch session:', error);
      return rejectWithValue('Network error occurred:');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; session: Session }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUserDetails: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearUser, updateUserDetails, logout } = userSlice.actions;
export default userSlice.reducer;
