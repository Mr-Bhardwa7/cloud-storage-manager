import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { FileItem } from '@/types/file';

// Helper function to sort files
const sortFiles = (
  files: FileItem[], 
  sortBy: 'name' | 'size' | 'modified', 
  sortDirection: 'asc' | 'desc'
): FileItem[] => {
  return [...files].sort((a, b) => {
    // Always put folders first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    
    // Then sort by the selected column
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        comparison = sizeA - sizeB;
        break;
      case 'modified':
        const modifiedA = a.modified ? new Date(a.modified).getTime() : 0;
        const modifiedB = b.modified ? new Date(b.modified).getTime() : 0;
        comparison = modifiedA - modifiedB;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

// Memoized selector for sorted and filtered files
export const selectSortedFilteredFiles = createSelector(
  [
    (state: RootState) => state.fileManager.files,
    (state: RootState) => state.fileManager.sortBy,
    (state: RootState) => state.fileManager.sortDirection,
    (state: RootState) => state.fileManager.searchTerm,
  ],
  (files, sortBy, sortDirection, searchTerm) => {
    // First filter by search term if present
    let filteredFiles = files;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(term)
      );
    }
    
    // Then sort the filtered files
    return sortFiles(filteredFiles, sortBy, sortDirection);
  }
);

// Selector for breadcrumb navigation
export const selectBreadcrumbPaths = createSelector(
  [(state: RootState) => state.fileManager.currentPath],
  (currentPath) => {
    const paths = [{ name: 'Home', path: '/' }];
    
    if (currentPath === '/') {
      return paths;
    }
    
    // Split the path and create breadcrumb items
    const segments = currentPath.split('/').filter(Boolean);
    let constructedPath = '';
    
    segments.forEach(segment => {
      constructedPath += `/${segment}`;
      paths.push({
        name: segment,
        path: constructedPath
      });
    });
    
    return paths;
  }
);