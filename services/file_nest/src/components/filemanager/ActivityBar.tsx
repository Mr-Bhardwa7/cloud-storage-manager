'use client';

import { useDispatch, useSelector } from 'react-redux';
import { FiFolder, FiSearch, FiGitBranch, FiPackage, FiSettings } from 'react-icons/fi';
import { setActiveView } from '@/store/uiSlice';
import { RootState } from '@/store/store';

export default function ActivityBar() {
  const dispatch = useDispatch();
  const activeView = useSelector((state: RootState) => state.ui.activeView);
  
  const handleViewChange = (view: string) => {
    dispatch(setActiveView(view));
  };
  
  return (
    <div className="w-12 bg-[var(--activity-bar-background)] flex flex-col items-center py-2">
      <button 
        className={`p-2 mb-2 rounded ${activeView === 'explorer' ? 'bg-[var(--activity-bar-badge-background)]' : ''}`}
        onClick={() => handleViewChange('explorer')}
        aria-label="Explorer"
      >
        <FiFolder className="w-5 h-5" />
      </button>
      
      <button 
        className={`p-2 mb-2 rounded ${activeView === 'search' ? 'bg-[var(--activity-bar-badge-background)]' : ''}`}
        onClick={() => handleViewChange('search')}
        aria-label="Search"
      >
        <FiSearch className="w-5 h-5" />
      </button>
      
      <button 
        className={`p-2 mb-2 rounded ${activeView === 'git' ? 'bg-[var(--activity-bar-badge-background)]' : ''}`}
        onClick={() => handleViewChange('git')}
        aria-label="Source Control"
      >
        <FiGitBranch className="w-5 h-5" />
      </button>
      
      <button 
        className={`p-2 mb-2 rounded ${activeView === 'extensions' ? 'bg-[var(--activity-bar-badge-background)]' : ''}`}
        onClick={() => handleViewChange('extensions')}
        aria-label="Extensions"
      >
        <FiPackage className="w-5 h-5" />
      </button>
      
      <div className="flex-1"></div>
      
      <button 
        className={`p-2 rounded ${activeView === 'settings' ? 'bg-[var(--activity-bar-badge-background)]' : ''}`}
        onClick={() => handleViewChange('settings')}
        aria-label="Settings"
      >
        <FiSettings className="w-5 h-5" />
      </button>
    </div>
  );
}