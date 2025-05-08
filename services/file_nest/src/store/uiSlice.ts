import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeView: string;
  sidebarWidth: number;
  editorLayout: 'horizontal' | 'vertical' | 'grid';
}

const initialState: UiState = {
  activeView: 'explorer',
  sidebarWidth: 240,
  editorLayout: 'horizontal',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<string>) => {
      state.activeView = action.payload;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    },
    setEditorLayout: (state, action: PayloadAction<'horizontal' | 'vertical' | 'grid'>) => {
      state.editorLayout = action.payload;
    },
  },
});

export const { setActiveView, setSidebarWidth, setEditorLayout } = uiSlice.actions;

export default uiSlice.reducer;