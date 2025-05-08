import { FiFolder, FiUpload, FiTrash2, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import { useAppDispatch } from '@/store/hooks';
import { setViewMode } from '@/store/fileManagerSlice';

interface ToolbarProps {
  selectedFiles: string[];
  viewMode: 'grid' | 'list';
  onNewFolder: () => void;
  onUpload: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}

export default function Toolbar({
  selectedFiles,
  viewMode,
  onNewFolder,
  onUpload,
  onDelete,
  onRefresh
}: ToolbarProps) {
  const dispatch = useAppDispatch();
  
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onNewFolder}
        >
          <FiFolder className="w-4 h-4" />
          <span className="hidden sm:inline">New Folder</span>
        </button>
        
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onUpload}
        >
          <FiUpload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
        </button>
        
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            selectedFiles.length > 0 
              ? 'hover:bg-gray-100 dark:hover:bg-gray-800' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={selectedFiles.length === 0}
          onClick={selectedFiles.length > 0 ? onDelete : undefined}
        >
          <FiTrash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Delete</span>
        </button>
        
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={onRefresh}
        >
          <FiRefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
        
        <div className="ml-auto flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            onClick={() => dispatch(setViewMode('grid'))}
            aria-label="Grid view"
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            onClick={() => dispatch(setViewMode('list'))}
            aria-label="List view"
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
