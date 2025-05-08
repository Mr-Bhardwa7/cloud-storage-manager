import { FiHome, FiChevronRight } from 'react-icons/fi';

interface BreadcrumbsProps {
  currentPath: string;
  onPathChange: (path: string) => void;
}

export default function Breadcrumbs({ currentPath, onPathChange }: BreadcrumbsProps) {
  // Split path into segments
  const segments = currentPath.split('/').filter(Boolean);
  
  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    // Build path up to this segment
    const path = '/' + segments.slice(0, index + 1).join('/');
    
    return {
      name: segment,
      path
    };
  });
  
  return (
    <div className="flex items-center overflow-x-auto whitespace-nowrap py-1 scrollbar-hide">
      <button
        className={`flex items-center p-1 rounded-md ${currentPath === '/' ? 'text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        onClick={() => onPathChange('/')}
      >
        <FiHome className="w-4 h-4" />
      </button>
      
      {breadcrumbs.length > 0 && (
        <FiChevronRight className="mx-1 text-gray-400 w-4 h-4" />
      )}
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          <button
            className={`px-1 py-0.5 rounded-md text-sm ${
              index === breadcrumbs.length - 1 
                ? 'font-medium text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onPathChange(crumb.path)}
          >
            {crumb.name}
          </button>
          
          {index < breadcrumbs.length - 1 && (
            <FiChevronRight className="mx-1 text-gray-400 w-4 h-4" />
          )}
        </div>
      ))}
    </div>
  );
}