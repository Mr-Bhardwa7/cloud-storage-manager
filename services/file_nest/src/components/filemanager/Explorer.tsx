'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiChevronDown, FiChevronRight, FiFolder, FiFile } from 'react-icons/fi';
import { RootState } from '@/store/store';

// Define types for the folder structure
interface FileNode {
  name: string;
  type: 'file' | 'folder' | 'root';
  children?: FileNode[];
}

export default function Explorer() {
  const activeView = useSelector((state: RootState) => state.ui.activeView);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    'services', 'src', 'app', 'api', 'filemanager', 'components'
  ]);
  
  // Update type annotation for folderStructure
  const folderStructure: FileNode = {
    name: 'CLOUD-STORAGE-MANAGEMENT',
    type: 'root',
    children: [
      {
        name: 'services',
        type: 'folder',
        children: [
          {
            name: 'file_nest',
            type: 'folder',
            children: [
              { name: 'node_modules', type: 'folder', children: [] },
              { name: 'public', type: 'folder', children: [] },
              { name: 'src', type: 'folder', children: [
                { name: 'app', type: 'folder', children: [
                  { name: '(routes)', type: 'folder', children: [] },
                  { name: 'api', type: 'folder', children: [
                    { name: 'filemanager', type: 'folder', children: [
                      { name: 'download', type: 'folder', children: [
                        { name: 'route.ts', type: 'file' }
                      ]},
                      { name: 'operations', type: 'folder', children: [
                        { name: 'route.ts', type: 'file' }
                      ]},
                      { name: 'upload', type: 'folder', children: [
                        { name: 'route.ts', type: 'file' }
                      ]}
                    ]}
                  ]},
                  { name: 'libs', type: 'folder', children: [] },
                  { name: 'locales', type: 'folder', children: [] },
                  { name: 'filemanager', type: 'folder', children: [
                    { name: 'page.tsx', type: 'file' },
                    { name: 'favicon.ico', type: 'file' },
                    { name: 'globals.css', type: 'file' },
                    { name: 'layout.tsx', type: 'file' },
                    { name: 'page.tsx', type: 'file' }
                  ]},
                  { name: 'components', type: 'folder', children: [
                    { name: 'filemanager', type: 'folder', children: [
                      { name: 'Breadcrumbs.tsx', type: 'file' },
                      { name: 'NavigationPane.tsx', type: 'file' },
                      { name: 'Toolbar.tsx', type: 'file' }
                    ]}
                  ]},
                  { name: 'controllers', type: 'folder', children: [] }
                ]}
              ]}
            ]
          }
        ]
      }
    ]
  };
  
  const toggleFolder = (folderPath: string) => {
    if (expandedFolders.includes(folderPath)) {
      setExpandedFolders(expandedFolders.filter(path => path !== folderPath));
    } else {
      setExpandedFolders([...expandedFolders, folderPath]);
    }
  };
  
  // Replace any with proper type
  interface TreeItem {
    name: string;
    type: 'file' | 'folder' | 'root';
    children?: TreeItem[];
  }
  
  const renderTree = (item: TreeItem, path = '', level = 0) => {
    const currentPath = path ? `${path}/${item.name}` : item.name;
    const isExpanded = expandedFolders.includes(item.name);
    
    return (
      <div key={currentPath} className="text-sm">
        <div 
          className="flex items-center hover:bg-[var(--list-hover-background)] py-1 px-2"
          style={{ paddingLeft: `${level * 8 + 8}px` }}
        >
          {item.type === 'folder' && (
            <button 
              className="mr-1 focus:outline-none"
              onClick={() => toggleFolder(item.name)}
            >
              {isExpanded ? <FiChevronDown className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
            </button>
          )}
          
          {item.type === 'folder' ? (
            <FiFolder className="w-4 h-4 mr-1 text-blue-500" />
          ) : (
            <FiFile className="w-4 h-4 mr-1 text-gray-500" />
          )}
          
          <span>{item.name}</span>
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map((child: TreeItem) => renderTree(child, currentPath, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  if (activeView !== 'explorer') {
    return null;
  }
  
  return (
    <div className="w-64 bg-[var(--sidebar-background)] border-r border-[var(--border)] overflow-y-auto">
      <div className="p-2 uppercase text-xs font-bold flex items-center justify-between">
        <span>Explorer</span>
        <button className="p-1 rounded hover:bg-[var(--button-hover-background)]">...</button>
      </div>
      
      <div className="p-1">
        {renderTree(folderStructure)}
      </div>
    </div>
  );
}