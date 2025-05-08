import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import tabsReducer from './tabsSlice';
import fileManagerReducer from './fileManagerSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    tabs: tabsReducer,
    fileManager: fileManagerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
