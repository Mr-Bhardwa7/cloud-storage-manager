'use client';

import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { FiSearch, FiFolder, FiFile, FiGitBranch, FiClock, FiCloud, FiArrowRight, FiPlus, FiGrid, FiList, FiRefreshCw } from 'react-icons/fi';

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

export default function FileManagerPage() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [splitView, setSplitView] = useState(true);
  const [splitDirection, setSplitDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [leftAccount, setLeftAccount] = useState<string | null>(null);
  const [rightAccount, setRightAccount] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isMoving, setIsMoving] = useState(false);
  
  // Mock accounts data
  const accounts: Account[] = [
    { id: '1', name: 'Work Drive', email: 'work@example.com', provider: 'google', icon: '/google-drive.svg' },
    { id: '2', name: 'Personal Drive', email: 'personal@example.com', provider: 'google', icon: '/google-drive.svg' },
    { id: '3', name: 'Dropbox', email: 'user@example.com', provider: 'dropbox', icon: '/dropbox.svg' },
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
      { id: '301', name: 'Shared', type: 'folder', modified: '2023-03-05', path: '/Shared' },
      { id: '302', name: 'Presentation.pptx', type: 'file', size: 3500000, modified: '2023-03-10', path: '/Presentation.pptx' },
    ],
  });
  
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
  
  const handleFileSelect = (fileId: string) => {
    if (selectedFiles.includes(fileId)) {
      setSelectedFiles(selectedFiles.filter(id => id !== fileId));
    } else {
      setSelectedFiles([...selectedFiles, fileId]);
    }
  };
  
  const handleMoveFiles = () => {
    if (!leftAccount || !rightAccount || selectedFiles.length === 0) return;
    
    // In a real app, this would be an API call to move files between accounts
    const updatedFiles = { ...files };
    
    // Find the selected files in the source account
    const filesToMove = updatedFiles[leftAccount].filter(file => selectedFiles.includes(file.id));
    
    // Remove files from source account
    updatedFiles[leftAccount] = updatedFiles[leftAccount].filter(file => !selectedFiles.includes(file.id));
    
    // Add files to destination account
    updatedFiles[rightAccount] = [...updatedFiles[rightAccount], ...filesToMove];
    
    setFiles(updatedFiles);
    setSelectedFiles([]);
    setIsMoving(false);
  };
  
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
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
                  {item === 'File' && (
                    <>
                      <button className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center">
                        <span>New File</span>
                      </button>
                      <button className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center">
                        <span>New Folder</span>
                      </button>
                      <div className="border-t border-[#3c3c3c] my-1"></div>
                      <button className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center">
                        <span>Upload File</span>
                      </button>
                    </>
                  )}
                  {item === 'View' && (
                    <>
                      <button 
                        className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center justify-between"
                        onClick={() => setSplitView(!splitView)}
                      >
                        <span>{splitView ? 'Single View' : 'Split View'}</span>
                      </button>
                      {splitView && (
                        <button 
                          className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center justify-between"
                          onClick={() => setSplitDirection(splitDirection === 'horizontal' ? 'vertical' : 'horizontal')}
                        >
                          <span>{splitDirection === 'horizontal' ? 'Split Vertically' : 'Split Horizontally'}</span>
                        </button>
                      )}
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
                      <div className="border-t border-[#3c3c3c] my-1"></div>
                      <div className="px-4 py-1.5 text-[#bbbbbb]">Manage Accounts</div>
                      {accounts.map(account => (
                        <button key={account.id} className="w-full text-left px-4 py-1.5 hover:bg-[#04395e] flex items-center justify-between">
                          <span>{account.name}</span>
                          <span className="text-xs text-[#bbbbbb]">{account.email}</span>
                        </button>
                      ))}
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
              className="p-1.5 rounded hover:bg-[#383838]"
              onClick={() => setSplitView(!splitView)}
            >
              <FiGrid className="w-4 h-4" />
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
              >
                <span className="text-xs">Confirm Move</span>
              </button>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-2">
            <button 
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#383838]' : 'hover:bg-[#383838]'}`}
              onClick={() => setViewMode('list')}
            >
              <FiList className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#383838]' : 'hover:bg-[#383838]'}`}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Activity Bar */}
          <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#252526]">
            <button 
              className={`w-12 h-12 flex items-center justify-center mb-2 ${activeTab === 'explorer' ? 'text-white border-l-2 border-l-white' : 'text-[#858585] hover:text-white'}`}
              onClick={() => setActiveTab('explorer')}
            >
              <FiFolder className="w-6 h-6" />
            </button>
            <button 
              className={`w-12 h-12 flex items-center justify-center mb-2 ${activeTab === 'search' ? 'text-white border-l-2 border-l-white' : 'text-[#858585] hover:text-white'}`}
              onClick={() => setActiveTab('search')}
            >
              <FiSearch className="w-6 h-6" />
            </button>
            <button 
              className={`w-12 h-12 flex items-center justify-center mb-2 ${activeTab === 'cloud' ? 'text-white border-l-2 border-l-white' : 'text-[#858585] hover:text-white'}`}
              onClick={() => setActiveTab('cloud')}
            >
              <FiCloud className="w-6 h-6" />
            </button>
          </div>
          
          {/* Accounts Sidebar */}
          <div className="w-64 bg-[#252526] overflow-y-auto border-r border-[#1e1e1e]">
            <div className="p-2 uppercase text-xs font-semibold tracking-wider text-[#bbbbbb] flex justify-between items-center">
              Cloud Accounts
              <button className="p-1 hover:bg-[#383838] rounded">
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-2">
              {accounts.map(account => (
                <div 
                  key={account.id}
                  className={`p-2 rounded mb-1 cursor-pointer ${
                    leftAccount === account.id ? 'bg-[#04395e]' : 'hover:bg-[#383838]'
                  }`}
                  onClick={() => setLeftAccount(account.id)}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-2 flex-shrink-0">
                      {account.provider === 'google' && (
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                          <span className="text-[#4285F4] text-xs font-bold">G</span>
                        </div>
                      )}
                      {account.provider === 'dropbox' && (
                        <div className="w-6 h-6 bg-[#0061FF] rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">D</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{account.name}</div>
                      <div className="text-xs text-[#bbbbbb]">{account.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* File Explorer Area */}
          <div className={`flex flex-1 ${splitDirection === 'horizontal' ? 'flex-col' : 'flex-row'}`}>
            {/* Left/Top Pane */}
            <div className={`${splitView ? (splitDirection === 'horizontal' ? 'h-1/2' : 'w-1/2') : 'w-full h-full'} flex flex-col border-r border-[#1e1e1e] overflow-hidden`}>
              {/* Account selector */}
              <div className="h-8 bg-[#2d2d2d] flex items-center px-3 border-b border-[#1e1e1e]">
                <select 
                  className="bg-[#3c3c3c] text-[#cccccc] border-none rounded px-2 py-0.5 text-xs w-48"
                  value={leftAccount || ''}
                  onChange={(e) => setLeftAccount(e.target.value)}
                >
                  <option value="">Select Account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Files list */}
              <div className="flex-1 overflow-auto">
                {leftAccount && files[leftAccount] ? (
                  viewMode === 'list' ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="w-6">
                            <input 
                              type="checkbox" 
                              className="cursor-pointer"
                              checked={selectedFiles.length === files[leftAccount].length}
                              onChange={() => {
                                if (selectedFiles.length === files[leftAccount].length) {
                                  setSelectedFiles([]);
                                } else {
                                  setSelectedFiles(files[leftAccount].map(file => file.id));
                                }
                              }}
                            />
                          </th>
                          <th>Name</th>
                          <th>Size</th>
                          <th>Modified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {files[leftAccount].map(file => (
                          <tr key={file.id} className="hover:bg-[#3c3c3c]">
                            <td className="p-2">
                              <input 
                                type="checkbox" 
                                className="cursor-pointer"
                                checked={selectedFiles.includes(file.id)}
                                onChange={() => handleFileSelect(file.id)}
                              />
                            </td>
                            <td className="p-2">
                              <div className="flex items-center">
                                {file.type === 'folder' ? (
                                  <FiFolder className="w-4 h-4 mr-2" />
                                ) : (
                                  <FiFile className="w-4 h-4 mr-2" />
                                )}
                                <span>{file.name}</span>
                              </div>
                            </td>
                            <td className="p-2">{formatFileSize(file.size)}</td>
                            <td className="p-2">{new Date(file.modified).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="grid grid-cols-4 gap-4 p-4">
                      {files[leftAccount].map(file => (
                        <div 
                          key={file.id}
                          className={`p-2 rounded cursor-pointer ${
                            selectedFiles.includes(file.id) ? 'bg-[#04395e]' : 'hover:bg-[#383838]'
                          }`}
                          onClick={() => handleFileSelect(file.id)}
                        >
                          <div className="flex items-center">
                            {file.type === 'folder' ? (
                              <FiFolder className="w-6 h-6 mr-2" />
                            ) : (
                              <FiFile className="w-6 h-6 mr-2" />
                            )}
                            <span>{file.name}</span>
                          </div>
                          <div className="text-xs text-[#bbbbbb]">
                            {formatFileSize(file.size)}
                            <br />
                            {new Date(file.modified).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="p-4 text-center text-[#bbbbbb]">Select an account to view files</div>
                )}
              </div>
            </div>
            
            {splitView && (
              <div className={`w-1/2 ${splitDirection === 'horizontal' ? 'h-full' : 'h-1/2'}`}>
                {/* Right/Bottom Pane */}
                <div className="h-8 bg-[#2d2d2d] flex items-center px-3 border-b border-[#1e1e1e]">
                  <select 
                    className="bg-[#3c3c3c] text-[#cccccc] border-none rounded px-2 py-0.5 text-xs w-48"
                    value={rightAccount || ''}
                    onChange={(e) => setRightAccount(e.target.value)}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Files list */}
                <div className="flex-1 overflow-auto">
                  {rightAccount && files[rightAccount] ? (
                    viewMode === 'list' ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="w-6">
                              <input 
                                type="checkbox" 
                                className="cursor-pointer"
                                checked={selectedFiles.length === files[rightAccount].length}
                                onChange={() => {
                                  if (selectedFiles.length === files[rightAccount].length) {
                                    setSelectedFiles([]);
                                  } else {
                                    setSelectedFiles(files[rightAccount].map(file => file.id));
                                  }
                                }}
                              />
                            </th>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Modified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {files[rightAccount].map(file => (
                            <tr key={file.id} className="hover:bg-[#3c3c3c]">
                              <td className="p-2">
                                <input 
                                  type="checkbox" 
                                  className="cursor-pointer"
                                  checked={selectedFiles.includes(file.id)}
                                  onChange={() => handleFileSelect(file.id)}
                                />
                              </td>
                              <td className="p-2">
                                <div className="flex items-center">
                                  {file.type === 'folder' ? (
                                    <FiFolder className="w-4 h-4 mr-2" />
                                  ) : (
                                    <FiFile className="w-4 h-4 mr-2" />
                                  )}
                                  <span>{file.name}</span>
                                </div>
                              </td>
                              <td className="p-2">{formatFileSize(file.size)}</td>
                              <td className="p-2">{new Date(file.modified).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="grid grid-cols-4 gap-4 p-4">
                        {files[rightAccount].map(file => (
                          <div 
                            key={file.id}
                            className={`p-2 rounded cursor-pointer ${
                              selectedFiles.includes(file.id) ? 'bg-[#04395e]' : 'hover:bg-[#383838]'
                            }`}
                            onClick={() => handleFileSelect(file.id)}
                          >
                            <div className="flex items-center">
                              {file.type === 'folder' ? (
                                <FiFolder className="w-6 h-6 mr-2" />
                              ) : (
                                <FiFile className="w-6 h-6 mr-2" />
                              )}
                              <span>{file.name}</span>
                            </div>
                            <div className="text-xs text-[#bbbbbb]">
                              {formatFileSize(file.size)}
                              <br />
                              {new Date(file.modified).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="p-4 text-center text-[#bbbbbb]">Select an account to view files</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Status Bar (E) */}
        <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-2 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <FiGitBranch className="mr-1" />
              <span>main</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-1" />
              <span>Ln 42, Col 18</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span>UTF-8</span>
            <span>TypeScript</span>
            <button 
              className="hover:bg-[#1f8ad2] px-1 py-0.5"
              onClick={() => {
                setPanelVisible(!panelVisible);
              }}
            >
              {panelVisible ? 'Hide Terminal' : 'Show Terminal'}
            </button>
          </div>
        </div>
      </div>
    </Provider>
  );
}









