'use client';

import { useSelector, useDispatch } from 'react-redux';
import { FiX } from 'react-icons/fi';
import { RootState } from '@/store/store';
import { closeTab, setActiveTab } from '@/store/tabsSlice';

export default function EditorArea() {
  const dispatch = useDispatch();
  const tabs = useSelector((state: RootState) => state.tabs.tabs);
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);
  
  const handleTabClick = (tabId: string) => {
    dispatch(setActiveTab(tabId));
  };
  
  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    dispatch(closeTab(tabId));
  };
  
  return (
    <div className="flex-1 flex flex-col bg-[var(--editor-background)]">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border)]">
        {tabs.length > 0 ? (
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <div 
                key={tab.id}
                className={`flex items-center px-3 py-2 border-r border-[var(--border)] cursor-pointer ${
                  activeTab === tab.id ? 'bg-[var(--tab-active-background)]' : 'bg-[var(--tab-background)]'
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="text-sm mr-2">{tab.title}</span>
                <button 
                  className="p-1 rounded-full hover:bg-[var(--button-hover-background)]"
                  onClick={(e) => handleTabClose(e, tab.id)}
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-2 text-sm text-[var(--foreground-secondary)]">No files open</div>
        )}
      </div>
      
      {/* Editor content */}
      <div className="flex-1 p-4 overflow-auto">
        {tabs.length > 0 && activeTab ? (
          <div>
            {/* This would be your actual editor component */}
            <div className="text-sm font-mono">
              <div className="flex">
                <div className="w-8 text-right pr-2 text-[var(--foreground-secondary)]">1</div>
                <div>First File Manager Page</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--foreground-secondary)]">
            <div className="text-center">
              <h3 className="text-xl mb-2">FileNest</h3>
              <p className="text-sm">Open a file to start editing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}