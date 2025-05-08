import { useState, useEffect } from 'react';
import { FiFolder, FiChevronRight, FiChevronDown, FiHardDrive, FiStar, FiClock, FiTrash2 } from 'react-icons/fi';

// Add this interface before NavigationPaneProps
interface ContextMenuItem {
  type: 'folder';
  path: string;
  name: string;
}

interface NavigationPaneProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, item: ContextMenuItem) => void;
}

interface FolderItem {
  name: string;
  path: string;
  children?: FolderItem[];
  isExpanded?: boolean;
}

export default function NavigationPane({ currentPath, onPathChange, onContextMenu }: NavigationPaneProps) {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch folder structure on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockFolders: FolderItem[] = [
          {
            name: 'My Files',
            path: '/',
            isExpanded: true,
            children: [
              {
                name: 'Documents',
                path: '/Documents',
                children: [
                  { name: 'Work', path: '/Documents/Work' },
                  { name: 'Personal', path: '/Documents/Personal' }
                ]
              },
              {
                name: 'Images',
                path: '/Images',
                children: [
                  { name: 'Vacation', path: '/Images/Vacation' },
                  { name: 'Family', path: '/Images/Family' }
                ]
              },
              { name: 'Videos', path: '/Videos' },
              { name: 'Music', path: '/Music' }
            ]
          }
        ];
        
        setFolders(mockFolders);
      } catch (error) {
        console.error('Failed to fetch folders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFolders();
  }, []);
  
  // Toggle folder expansion
  const toggleFolder = (path: string) => {
    const updateFolders = (items: FolderItem[]): FolderItem[] => {
      return items.map(folder => {
        if (folder.path === path) {
          return { ...folder, isExpanded: !folder.isExpanded };
        }
        
        if (folder.children) {
          return {
            ...folder,
            children: updateFolders(folder.children)
          };
        }
        
        return folder;
      });
    };
    
    setFolders(updateFolders(folders));
  };
  
  // Render folder tree recursively
  const renderFolders = (items: FolderItem[], level = 0) => {
    return items.map(folder => (
      <div key={folder.path} style={{ paddingLeft: `${level * 12}px` }}>
        <div
          className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
            currentPath === folder.path ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          onClick={() => onPathChange(folder.path)}
          onContextMenu={(e) => onContextMenu(e, { type: 'folder', path: folder.path, name: folder.name })}
        >
          {folder.children && folder.children.length > 0 ? (
            <button
              className="p-1 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(folder.path);
              }}
            >
              {folder.isExpanded ? (
                <FiChevronDown className="w-3 h-3" />
              ) : (
                <FiChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}
          
          <FiFolder className={`w-4 h-4 mr-2 ${currentPath === folder.path ? 'text-blue-600 dark:text-blue-400' : ''}`} />
          <span className="text-sm truncate">{folder.name}</span>
        </div>
        
        {folder.children && folder.isExpanded && (
          <div className="ml-2">
            {renderFolders(folder.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">FileNest</h2>
        
        <div className="space-y-1 mb-6">
          <div
            className={`flex items-center py-2 px-3 rounded-md cursor-pointer ${
              currentPath === '/' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onPathChange('/')}
          >
            <FiHardDrive className="w-4 h-4 mr-3" />
            <span className="text-sm">All Files</span>
          </div>
          
          <div
            className="flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onPathChange('/recent')}
          >
            <FiClock className="w-4 h-4 mr-3" />
            <span className="text-sm">Recent</span>
          </div>
          
          <div
            className="flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onPathChange('/starred')}
          >
            <FiStar className="w-4 h-4 mr-3" />
            <span className="text-sm">Starred</span>
          </div>
          
          <div
            className="flex items-center py-2 px-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onPathChange('/trash')}
          >
            <FiTrash2 className="w-4 h-4 mr-3" />
            <span className="text-sm">Trash</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold mb-2 px-2">Folders</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-1">
              {renderFolders(folders)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}