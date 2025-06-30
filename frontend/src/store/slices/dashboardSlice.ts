import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Zone = 'quality' | 'velocity' | 'happiness' | 'business';

interface DashboardState {
  currentZone: Zone;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  currentZone: 'quality',
  lastUpdated: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setCurrentZone: (state, action: PayloadAction<Zone>) => {
      state.currentZone = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLastUpdated: (state, action: PayloadAction<string>) => {
      state.lastUpdated = action.payload;
    },
  },
});

export const { 
  setCurrentZone, 
  setLoading, 
  setError, 
  clearError, 
  setLastUpdated 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;