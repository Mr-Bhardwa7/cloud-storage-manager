import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tab {
  id: string;
  title: string;
  path: string;
  type: string;
  content?: string;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string | null;
}

const initialState: TabsState = {
  tabs: [],
  activeTab: null,
};

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    openTab: (state, action: PayloadAction<Tab>) => {
      const existingTab = state.tabs.find(tab => tab.id === action.payload.id);
      if (!existingTab) {
        state.tabs.push(action.payload);
      }
      state.activeTab = action.payload.id;
    },
    closeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
      if (tabIndex !== -1) {
        state.tabs.splice(tabIndex, 1);
        
        // If we closed the active tab, activate another tab if available
        if (state.activeTab === action.payload) {
          if (state.tabs.length > 0) {
            // Activate the tab to the left, or the first tab if there's no tab to the left
            const newActiveIndex = Math.max(0, tabIndex - 1);
            state.activeTab = state.tabs[newActiveIndex].id;
          } else {
            state.activeTab = null;
          }
        }
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    updateTabContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        tab.content = action.payload.content;
      }
    },
  },
});

export const { openTab, closeTab, setActiveTab, updateTabContent } = tabsSlice.actions;

export default tabsSlice.reducer;