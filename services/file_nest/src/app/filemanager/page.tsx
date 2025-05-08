'use client';

import { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiArrowRight, FiGrid, FiRefreshCw, 
  FiPlus, FiX, FiList, FiColumns } from 'react-icons/fi';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import React from 'react';
import FileTree, { FileNode } from '@/components/filemanager/FileTree';

type Account = {
  id: string;
  name: string;
  email: string;
  provider: 'google' | 'dropbox' | 'onedrive';
  icon: string;
};

type FileItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  path: string;
};

type PaneConfig = {
  id: string;
  accountId: string | null;
};

export default function FileManagerPage() {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [panes, setPanes] = useState<PaneConfig[]>([
    { id: '1', accountId: null }
  ]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isMoving, setIsMoving] = useState(false);
  const [sourcePane, setSourcePane] = useState<string | null>(null);
  const [targetPane, setTargetPane] = useState<string | null>(null);
  const [fileTreeVisible, setFileTreeVisible] = useState<Record<string, boolean>>({});
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [splitView, setSplitView] = useState(true);
  const [splitDirection, setSplitDirection] = useState<'vertical' | 'horizontal'>('vertical');
  
  // Mock accounts data
  const accounts: Account[] = [
    { id: '1', name: 'Work Drive', email: 'work@example.com', provider: 'google', icon: '/google-drive.svg' },
    { id: '2', name: 'Personal Drive', email: 'personal@example.com', provider: 'google', icon: '/google-drive.svg' },
    { id: '3', name: 'Team Drive', email: 'team@example.com', provider: 'google', icon: '/google-drive.svg' },
    { id: '4', name: 'Dropbox', email: 'user@example.com', provider: 'dropbox', icon: '/dropbox.svg' },
  ];
  
  // Mock files data
  const [files, setFiles] = useState<Record<string, FileItem[]>>({
    '1': [
      { id: '101', name: 'Work Documents', type: 'folder', modified: '2023-05-15', path: '/Work Documents' },
      { id: '102', name: 'Project Proposal.docx', type: 'file', size: 1500000, modified: '2023-05-20', path: '/Project Proposal.docx' },
      { id: '103', name: 'Budget.xlsx', type: 'file', size: 2500000, modified: '2023-05-18', path: '/Budget.xlsx' },
    ],
    '2': [
      { id: '201', name: 'Photos', type: 'folder', modified: '2023-04-10', path: '/Photos' },
      { id: '202', name: 'Vacation.jpg', type: 'file', size: 5000000, modified: '2023-04-15', path: '/Vacation.jpg' },
      { id: '203', name: 'Notes.txt', type: 'file', size: 10000, modified: '2023-04-20', path: '/Notes.txt' },
    ],
    '3': [
      { id: '301', name: 'Team Projects', type: 'folder', modified: '2023-06-05', path: '/Team Projects' },
      { id: '302', name: 'Meeting Notes.docx', type: 'file', size: 500000, modified: '2023-06-10', path: '/Meeting Notes.docx' },
    ],
    '4': [
      { id: '401', name: 'Shared', type: 'folder', modified: '2023-03-05', path: '/Shared' },
      { id: '402', name: 'Presentation.pptx', type: 'file', size: 3500000, modified: '2023-03-10', path: '/Presentation.pptx' },
    ],
  });
  
  // Mock hierarchical file structure
  const [fileTree, setFileTree] = useState<Record<string, FileNode[]>>({
    '1': [
      {
        id: '101',
        name: 'Work Documents',
        type: 'folder',
        path: '/Work Documents',
        children: [
          { id: '1011', name: 'Project A', type: 'folder', path: '/Work Documents/Project A', 
            children: [
              { id: '10111', name: 'Requirements.docx', type: 'file', size: 250000, path: '/Work Documents/Project A/Requirements.docx' },
              { id: '10112', name: 'Timeline.xlsx', type: 'file', size: 180000, path: '/Work Documents/Project A/Timeline.xlsx' }
            ]
          },
          { id: '1012', name: 'Project B', type: 'folder', path: '/Work Documents/Project B',
            children: [
              { id: '10121', name: 'Proposal.pdf', type: 'file', size: 420000, path: '/Work Documents/Project B/Proposal.pdf' }
            ]
          },
          { id: '1013', name: 'Meeting Notes.txt', type: 'file', size: 15000, path: '/Work Documents/Meeting Notes.txt' }
        ]
      },
      { id: '102', name: 'Project Proposal.docx', type: 'file', size: 1500000, path: '/Project Proposal.docx' },
      { id: '103', name: 'Budget.xlsx', type: 'file', size: 2500000, path: '/Budget.xlsx' },
    ],
    '2': [
      {
        id: '201',
        name: 'Photos',
        type: 'folder',
        path: '/Photos',
        children: [
          { id: '2011', name: 'Vacation 2023', type: 'folder', path: '/Photos/Vacation 2023',
            children: [
              { id: '20111', name: 'Beach.jpg', type: 'file', size: 3500000, path: '/Photos/Vacation 2023/Beach.jpg' },
              { id: '20112', name: 'Mountains.jpg', type: 'file', size: 4200000, path: '/Photos/Vacation 2023/Mountains.jpg' }
            ]
          },
          { id: '2012', name: 'Family', type: 'folder', path: '/Photos/Family',
            children: [
              { id: '20121', name: 'Birthday.jpg', type: 'file', size: 2800000, path: '/Photos/Family/Birthday.jpg' }
            ]
          }
        ]
      },
      { id: '202', name: 'Vacation.jpg', type: 'file', size: 5000000, path: '/Vacation.jpg' },
      { id: '203', name: 'Notes.txt', type: 'file', size: 10000, path: '/Notes.txt' },
    ],
    '3': [
      {
        id: '301',
        name: 'Team Projects',
        type: 'folder',
        path: '/Team Projects',
        children: [
          { id: '3011', name: 'Roadmap', type: 'folder', path: '/Team Projects/Roadmap',
            children: [
              { id: '30111', name: 'Q1 Goals.pdf', type: 'file', size: 350000, path: '/Team Projects/Roadmap/Q1 Goals.pdf' },
              { id: '30112', name: 'Q2 Goals.pdf', type: 'file', size: 380000, path: '/Team Projects/Roadmap/Q2 Goals.pdf' }
            ]
          }
        ]
      },
      { id: '302', name: 'Meeting Notes.docx', type: 'file', size: 500000, path: '/Meeting Notes.docx' },
    ],
    '4': [
      {
        id: '401',
        name: 'Shared',
        type: 'folder',
        path: '/Shared',
        children: [
          { id: '4011', name: 'Presentations', type: 'folder', path: '/Shared/Presentations',
            children: [
              { id: '40111', name: 'Company Overview.pptx', type: 'file', size: 3500000, path: '/Shared/Presentations/Company Overview.pptx' }
            ]
          }
        ]
      }
    ]
  });

  // Initialize file tree visibility for each pane
  useEffect(() => {
    const initialFileTreeVisible: Record<string, boolean> = {};
    panes.forEach(pane => {
      initialFileTreeVisible[pane.id] = true;
    });
    setFileTreeVisible(initialFileTreeVisible);
  }, []);

  const menuItems = ['File', 'Edit', 'View', 'Accounts', 'Help'];
  
  const toggleMenu = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === item ? null : item);
  };
  
  useEffect(() => {
    const handleClickOutside = () => {
      setMenuOpen(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const handleFileSelect = (fileId: string, accountId: string) => {
    console.log("Selected accountId:", accountId);
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };
  
  const handleMoveFiles = () => {
    if (!sourcePane || !targetPane || selectedFiles.length === 0) return;
    
    const sourceAccount = panes.find(p => p.id === sourcePane)?.accountId;
    const targetAccount = panes.find(p => p.id === targetPane)?.accountId;
    
    if (!sourceAccount || !targetAccount) return;
    
    // In a real app, this would be an API call to move files between accounts
    const updatedFiles = { ...files };
    
    // Find the selected files in the source account
    const filesToMove = updatedFiles[sourceAccount].filter(file => selectedFiles.includes(file.id));
    
    // Remove files from source account
    updatedFiles[sourceAccount] = updatedFiles[sourceAccount].filter(file => !selectedFiles.includes(file.id));
    
    // Add files to destination account
    updatedFiles[targetAccount] = [...updatedFiles[targetAccount], ...filesToMove];
    
    setFiles(updatedFiles);
    setSelectedFiles([]);
    setIsMoving(false);
    setSourcePane(null);
    setTargetPane(null);
  };
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  const addPane = () => {
    const newId = (panes.length + 1).toString();
    setPanes([...panes, { id: newId, accountId: null }]);
  };
  
  const removePane = (paneId: string) => {
    if (panes.length <= 1) return;
    setPanes(panes.filter(pane => pane.id !== paneId));
  };
  
  const setAccountForPane = (paneId: string, accountId: string) => {
    setPanes(panes.map(pane => 
      pane.id === paneId ? { ...pane, accountId } : pane
    ));
    
    // Also set the selected account in the sidebar
    setSelectedAccount(accountId);
  };

  // Add new handlers for file tree operations
  const handleNodeSelect = (node: FileNode) => {
    if (node.type === 'folder') {
      // Handle folder selection
      console.log("Selected folder:", node.path);
    } else {
      // Handle file selection
      console.log("Selected file:", node.path);
    }
  };

  const handleCreateFolder = async (parentPath: string) => {
    if (!selectedAccount) return;
    
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    
    try {
      // In a real app, this would be an API call
      // For now, just update the state
      const newFolderId = Math.random().toString(36).substring(2, 11);
      const newFolder: FileNode = {
        id: newFolderId,
        name: folderName,
        type: 'folder',
        path: `${parentPath}/${folderName}`,
        children: []
      };
      
      // Update the file tree (this is simplified and would need recursion for deep paths)
      const updateFileTree = (nodes: FileNode[], path: string): FileNode[] => {
        return nodes.map(node => {
          if (node.path === path) {
            return {
              ...node,
              children: [...(node.children || []), newFolder]
            };
          } else if (node.children) {
            return {
              ...node,
              children: updateFileTree(node.children, path)
            };
          }
          return node;
        });
      };
      
      setFileTree({
        ...fileTree,
        [selectedAccount]: updateFileTree(fileTree[selectedAccount], parentPath)
      });
      
    } catch (error) {
      console.error('Failed to create folder:', error);
      alert('Failed to create folder');
    }
  };

  const handleDeleteItem = async (path: string, type: 'file' | 'folder') => {
    if (!selectedAccount) return;
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      // In a real app, this would be an API call
      // For now, just update the state
      const updateFileTree = (nodes: FileNode[], targetPath: string): FileNode[] => {
        return nodes.filter(node => node.path !== targetPath)
          .map(node => {
            if (node.children) {
              return {
                ...node,
                children: updateFileTree(node.children, targetPath)
              };
            }
            return node;
          });
      };
      
      setFileTree({
        ...fileTree,
        [selectedAccount]: updateFileTree(fileTree[selectedAccount], path)
      });
      
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  const handleRenameItem = async (path: string, type: 'file' | 'folder') => {
    if (!selectedAccount) return;
    
    const newName = prompt('Enter new name:');
    if (!newName) return;
    
    try {
      console.log("type", type);
      // In a real app, this would be an API call
      // For now, just show an alert
      alert(`Rename operation would be implemented here for ${path} to ${newName}`);
    } catch (error) {
      console.error('Failed to rename item:', error);
      alert('Failed to rename item');
    }
  };

  const handleMoveNode = (dragIds: string[], parentId: string | null) => {
    if (!selectedAccount) return;
    
    try {
      // In a real app, this would be an API call
      // For now, just update the state
      const moveNodes = (nodes: FileNode[], dragIds: string[], targetId: string | null): FileNode[] => {
        // Find the nodes to move
        const nodesToMove: FileNode[] = [];
        const remainingNodes = nodes.filter(node => {
          if (dragIds.includes(node.id)) {
            nodesToMove.push(node);
            return false;
          }
          return true;
        });
        
        // If no target, move to root
        if (!targetId) {
          return [...remainingNodes, ...nodesToMove];
        }
        
        // Find target and add nodes as children
        return remainingNodes.map(node => {
          if (node.id === targetId) {
            return {
              ...node,
              children: [...(node.children || []), ...nodesToMove]
            };
          } else if (node.children) {
            return {
              ...node,
              children: moveNodes(node.children, dragIds, targetId)
            };
          }
          return node;
        });
      };
      
      setFileTree({
        ...fileTree,
        [selectedAccount]: moveNodes(fileTree[selectedAccount], dragIds, parentId)
      });
      
    } catch (error) {
      console.error('Failed to move items:', error);
      alert('Failed to move items');
    }
  };

  // Toggle file tree visibility for a pane
  const toggleFileTree = (paneId: string) => {
    setFileTreeVisible({
      ...fileTreeVisible,
      [paneId]: !fileTreeVisible[paneId]
    });
  };
  
  // Render file list component
  const renderFileList = (accountId: string | null) => {
    if (!accountId || !files[accountId]) {
      return (
        <div className="p-4 text-center text-[#bbbbbb]">Select an account to view files</div>
      );
    }
    
    if (viewMode === 'list') {
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3c3c3c]">
              <th className="w-6 p-2">
                <input 
                  type="checkbox" 
                  className="cursor-pointer"
                  checked={selectedFiles.length > 0 && files[accountId].every(file => selectedFiles.includes(file.id))}
                  onChange={() => {
                    if (files[accountId].every(file => selectedFiles.includes(file.id))) {
                      setSelectedFiles(selectedFiles.filter(id => !files[accountId].some(file => file.id === id)));
                    } else {
                      setSelectedFiles([...new Set([...selectedFiles, ...files[accountId].map(file => file.id)])]);
                    }
                  }}
                />
              </th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">Modified</th>
            </tr>
          </thead>
          <tbody>
            {files[accountId].map(file => (
              <tr 
                key={file.id}
                className={`border-b border-[#3c3c3c] hover:bg-[#2a2d2e] ${selectedFiles.includes(file.id) ? 'bg-[#04395e]' : ''}`}
                onClick={() => handleFileSelect(file.id, accountId)}
              >
                <td className="p-2">
                  <input 
                    type="checkbox" 
                    className="cursor-pointer"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id, accountId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="p-2 flex items-center">
                  {file.type === 'folder' ? (
                    <FiFolder className="w-5 h-5 mr-2 text-[#dcb67a]" />
                  ) : (
                    <FiFile className="w-5 h-5 mr-2 text-[#75beff]" />
                  )}
                  {file.name}
                </td>
                <td className="p-2">{formatFileSize(file.size)}</td>
                <td className="p-2">{new Date(file.modified).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="grid grid-cols-3 gap-2 p-2">
          {files[accountId].map(file => (
            <div 
              key={file.id}
              className={`p-2 rounded cursor-pointer ${
                selectedFiles.includes(file.id) ? 'bg-[#04395e]' : 'hover:bg-[#2a2d2e]'
              }`}
              onClick={() => handleFileSelect(file.id, accountId)}
            >
              <div className="flex items-center justify-center mb-2">
                {file.type === 'folder' ? (
                  <FiFolder className="w-10 h-10 text-[#dcb67a]" />
                ) : (
                  <FiFile className="w-10 h-10 text-[#75beff]" />
                )}
              </div>
              <div className="text-center truncate">{file.name}</div>
              <div className="text-xs text-center text-[#bbbbbb]">
                {formatFileSize(file.size)}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };
  
  // Render file explorer pane
  const renderFileExplorer = (paneId: string) => {
    const pane = panes.find(p => p.id === paneId);
    const accountId = pane?.accountId || null;
    const showFileTree = fileTreeVisible[paneId];
    
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Account selector */}
        <div className="h-10 bg-[#2d2d2d] flex items-center px-3 border-b border-[#1e1e1e]">
          <select 
            className="bg-[#3c3c3c] text-[#cccccc] border-none rounded px-2 py-1.5 text-sm w-64"
            value={accountId || ''}
            onChange={(e) => setAccountForPane(paneId, e.target.value)}
          >
            <option value="">Select Account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.email})
              </option>
            ))}
          </select>
          
          <div className="ml-auto flex items-center space-x-2">
            <button
              className={`p-1 rounded hover:bg-[#383838] ${showFileTree ? 'bg-[#04395e] text-white' : ''}`}
              onClick={() => toggleFileTree(paneId)}
              title="Toggle file tree"
            >
              <FiColumns className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded hover:bg-[#383838] ${viewMode === 'list' ? 'bg-[#04395e] text-white' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <FiList className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded hover:bg-[#383838] ${viewMode === 'grid' ? 'bg-[#04395e] text-white' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <FiGrid className="w-4 h-4" />
            </button>
            {panes.length > 1 && (
              <button 
                className="p-1 rounded hover:bg-[#383838] text-[#cccccc]"
                onClick={() => removePane(paneId)}
                title="Close pane"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {isMoving && (
            <>
              {sourcePane === paneId && (
                <div className="ml-2 text-[#75beff] text-xs flex items-center">
                  <FiArrowRight className="mr-1" />
                  <span>Source pane</span>
                </div>
              )}
              {!sourcePane && accountId && (
                <button 
                  className="ml-2 px-2 py-1 rounded bg-[#4d8bb9] text-white text-xs hover:bg-[#04395e]"
                  onClick={() => setSourcePane(paneId)}
                >
                  Set as source
                </button>
              )}
              {sourcePane && sourcePane !== paneId && accountId && (
                <button 
                  className="ml-2 px-2 py-1 rounded bg-[#4d8bb9] text-white text-xs hover:bg-[#04395e]"
                  onClick={() => setTargetPane(paneId)}
                >
                  Set as target
                </button>
              )}
            </>
          )}
        </div>
        
        {/* Main content area with optional file tree */}
        <div className="flex-1 flex overflow-hidden">
          {showFileTree && accountId && (
            <div className="w-64 border-r border-[#1e1e1e] overflow-auto">
              <FileTree 
                data={fileTree[accountId] || []}
                onNodeSelect={handleNodeSelect}
                onCreateFolder={handleCreateFolder}
                onDeleteItem={handleDeleteItem}
                onRenameItem={(path, newName, type) => {
                  // Fix the parameter order to match the expected signature
                  handleRenameItem(path, type);
                }}
                onMoveNode={handleMoveNode}
              />
            </div>
          )}
          
          {/* Files list */}
          <div className="flex-1 overflow-auto">
            {renderFileList(accountId)}
          </div>
        </div>
      </div>
    );
  };
  
  // Custom resize handle for react-resizable-panels
  const ResizeHandle = ({ className = "" }: { className?: string }) => (
    <PanelResizeHandle 
      className={`w-1 bg-[#1e1e1e] hover:bg-[#4d8bb9] transition-colors ${className}`}
    />
  );
  
  // Render multiple panes
  const renderPanes = () => {
    return (
      <PanelGroup 
        direction={splitDirection === 'vertical' ? 'horizontal' : 'vertical'}
        className="h-full"
      >
        {panes.map((pane, index) => (
          <React.Fragment key={pane.id}>
            {index > 0 && <ResizeHandle />}
            <Panel defaultSize={100 / panes.length} minSize={15}>
              {renderFileExplorer(pane.id)}
            </Panel>
          </React.Fragment>
        ))}
      </PanelGroup>
    );
  };
  
  return (
    <Provider store={store}>
      <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#cccccc] font-sans">
        {/* Top menu bar */}
        <div className="h-8 flex items-center px-2 bg-[#3c3c3c] text-[#cccccc] text-xs">
          {menuItems.map((item) => (
            <div key={item} className="relative">
              <button 
                className={`px-2 py-1 hover:bg-[#505050] rounded-sm ${menuOpen === item ? 'bg-[#505050]' : ''}`}
                onClick={(e) => toggleMenu(item, e)}
              >
                {item}
              </button>
              
              {menuOpen === item && (
                <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#252526] shadow-lg border border-[#3c3c3c] z-50">
                  {item === 'View' && (
                    <>
                      <button 
                        className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center justify-between"
                        onClick={() => setSplitDirection(splitDirection === 'horizontal' ? 'vertical' : 'horizontal')}
                      >
                        <span>{splitDirection === 'horizontal' ? 'Split Vertically' : 'Split Horizontally'}</span>
                      </button>
                      <button 
                        className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center justify-between"
                        onClick={addPane}
                      >
                        <span>Add Pane</span>
                      </button>
                      <div className="border-t border-[#3c3c3c] my-1"></div>
                      <button 
                        className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center justify-between"
                        onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                      >
                        <span>{viewMode === 'list' ? 'Grid View' : 'List View'}</span>
                      </button>
                    </>
                  )}
                  {item === 'Accounts' && (
                    <>
                      <div className="px-4 py-1.5 text-[#bbbbbb]">Connect Account</div>
                      <button className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center">
                        <span>Add Google Drive</span>
                      </button>
                      <button className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center">
                        <span>Add Dropbox</span>
                      </button>
                      <button className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center">
                        <span>Add OneDrive</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Toolbar */}
        <div className="h-10 flex items-center px-3 bg-[#252526] border-b border-[#1e1e1e]">
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded hover:bg-[#383838]">
              <FiRefreshCw className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded ${splitView ? 'bg-[#04395e] text-white' : 'hover:bg-[#383838]'}`}
              onClick={() => setSplitView(!splitView)}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 rounded hover:bg-[#383838]"
              onClick={addPane}
              title="Add new pane"
            >
              <FiPlus className="w-4 h-4" />
            </button>
            {selectedFiles.length > 0 && (
              <button 
                className={`px-2 py-1 rounded ${isMoving ? 'bg-[#04395e] text-white' : 'hover:bg-[#383838]'}`}
                onClick={() => setIsMoving(!isMoving)}
              >
                <div className="flex items-center">
                  <FiArrowRight className="w-4 h-4 mr-1" />
                  <span className="text-xs">Move {selectedFiles.length} item{selectedFiles.length !== 1 ? 's' : ''}</span>
                </div>
              </button>
            )}
            {isMoving && (
              <button 
                className="px-2 py-1 rounded bg-[#4d8bb9] text-white hover:bg-[#04395e]"
                onClick={handleMoveFiles}
                disabled={!targetPane}
              >
                <span className="text-xs">Confirm Move</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Main content area with split panes */}
        <div className="flex-1 overflow-hidden">
          {splitView ? (
            renderPanes()
          ) : (
            renderFileExplorer(panes[0].id)
          )}
        </div>
        
        {/* Status bar */}
        <div className="h-6 bg-[#007acc] text-white text-xs flex items-center px-3">
          <div>
            {selectedFiles.length > 0 ? 
              `${selectedFiles.length} item${selectedFiles.length !== 1
                ? 's selected'
                : ' selected'
              }`
              : 'No items selected'
            }
          </div>
        </div>
      </div>
    </Provider>
  );
}













