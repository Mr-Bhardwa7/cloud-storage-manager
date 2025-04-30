import { Activity } from '@/types/activity';

interface ActivityItemProps {
  activity: Activity;
  onRemove: () => void;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
}

export default function ActivityItem({ activity, onRemove, isDropdownOpen, onToggleDropdown }: ActivityItemProps) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'success': return 'bg-green-50 text-green-700';
      case 'error': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={activity.account.icon || '/default-storage-icon.svg'}
            alt={activity.account.name || 'Storage Account'}
            className="w-8 h-8"
          />
          <div>
            <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
            <p className="text-sm text-gray-500">{activity.description}</p>
            <div className="mt-1 flex items-center space-x-2 text-xs">
              <span className={`px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                {activity.status}
              </span>
              <span className="text-gray-500">{activity.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={onRemove}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Hide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}