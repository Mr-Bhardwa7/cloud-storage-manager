import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FileItem } from '@/types/file';

interface FileManagerState {
  currentPath: string;
  files: FileItem[];
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'size' | 'modified';
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: FileManagerState = {
  currentPath: '/',
  files: [],
  selectedFiles: [],
  viewMode: 'grid',
  sortBy: 'name',
  sortDirection: 'asc',
  searchTerm: '',
  isLoading: false,
  error: null,
};

export const fileManagerSlice = createSlice({
  name: 'fileManager',
  initialState,
  reducers: {
    setCurrentPath: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
      state.selectedFiles = [];
    },
    setFiles: (state, action: PayloadAction<FileItem[]>) => {
      state.files = action.payload;
    },
    setSelectedFiles: (state, action: PayloadAction<string[]>) => {
      state.selectedFiles = action.payload;
    },
    toggleSelectedFile: (state, action: PayloadAction<string>) => {
      const path = action.payload;
      if (state.selectedFiles.includes(path)) {
        state.selectedFiles = state.selectedFiles.filter(p => p !== path);
      } else {
        state.selectedFiles = [...state.selectedFiles, path];
      }
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'size' | 'modified'>) => {
      state.sortBy = action.payload;
      // If clicking the same sort field, toggle direction
      if (state.sortBy === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Default to ascending for new sort field
        state.sortDirection = 'asc';
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCurrentPath, 
  setFiles, 
  setSelectedFiles,
  toggleSelectedFile,
  setViewMode,
  setSortBy,
  setSearchTerm,
  setLoading, 
  setError 
} = fileManagerSlice.actions;

export default fileManagerSlice.reducer;


