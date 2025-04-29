import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
    userType: 'individual' | 'company' | null;
    userDetails: Record<string, string>;
    teamMembers: Record<string, string>[];
    completed: boolean;
}

const initialState: OnboardingState = {
    userType: null,
    userDetails: {},
    teamMembers: [],
    completed: false
};

export const updateUserType = createAsyncThunk(
  'onboarding/updateUserType',
  async ({ userId, userType }: { userId: string; userType: 'individual' | 'company' }) => {
    const response = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userType }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user type');
    }

    const result = await response.json();
    return result.data;
  }
);

export const updateBusinessDetails = createAsyncThunk(
  'onboarding/updateBusinessDetails',
  async (details: {
    userId: string;
    name: string;
    email: string;
    description?: string;
    phone: string;
    website?: string;
    role?: string;
  }) => {
    const response = await fetch('/api/onboarding/business-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error('Failed to update business details');
    }

    return await response.json();
  }
);

export const updateTeamMembers = createAsyncThunk(
  'onboarding/updateTeamMembers',
  async ({ userId, members }: { 
    userId: string; 
    members: { name: string; position: string; email: string; }[] 
  }) => {
    const response = await fetch('/api/onboarding/team-member', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId, 
        members 
      }),
    });

    console.log('team members response', response);
    if (!response.ok) {
      throw new Error('Failed to update team members');
    }

    return await response.json();
  }
);

export const verifyMobile = createAsyncThunk(
  'onboarding/verifyMobile',
  async ({ userEmail }: { userEmail: string }) => {
    const response = await fetch('/api/onboarding/mobile-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify mobile');
    }

    return await response.json();
  }
);

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingDetails: (state, action: PayloadAction<{ 
      userType: 'individual' | 'company' | null;
      userDetails: Record<string, string>;
      teamMembers: Record<string, string>[];
      completed: boolean;
    }>) => {
      state.userType = action.payload.userType;
      state.userDetails = action.payload.userDetails;
      state.completed = action.payload.completed;
      state.teamMembers = action.payload.teamMembers;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserType.fulfilled, (state, action) => {
        state.userType = action.payload.userType.toLowerCase();
        state.completed = action.payload.completed;
    });
    builder.addCase(updateBusinessDetails.fulfilled, (state, action) => {
        state.userDetails = action.payload.data;
    });
    builder.addCase(updateTeamMembers.fulfilled, (state, action) => {
        state.teamMembers = action.payload.data;
    });
    builder.addCase(verifyMobile.fulfilled, (state, action) => {
        state.completed = action.payload.data.completed;
    });
  },
});

export const { setOnboardingDetails } = onboardingSlice.actions;
export default onboardingSlice.reducer;