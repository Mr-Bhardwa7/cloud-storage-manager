import { useState, useMemo } from 'react';
import ActivityItem from './ActivityItem';
import { Activity } from '@/types/activity';

interface ActivityListProps {
  activities: Activity[];
  searchTerm: string;
  providerFilter: string;
  dateRange: string;
  onActivityRemove: (id: string) => void;
  // Add these new props
  customStartDate: Date | null;
  customEndDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export default function ActivityList({ 
  activities, 
  searchTerm, 
  providerFilter, 
  dateRange, 
  onActivityRemove 
}: ActivityListProps) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const itemsPerPage = 4;

  // Filter activities based on search, provider, and date
  const [customStartDate] = useState<Date | null>(null);
  const [customEndDate] = useState<Date | null>(null);

  // Update the filter logic to include custom date range
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = searchTerm === '' || 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.account.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = providerFilter === 'all' || activity.account.provider === providerFilter;
      
      // Date filtering logic
      let matchesDate = true;
      if (dateRange === 'custom' && customStartDate && customEndDate) {
        const activityDate = new Date(activity.timestamp);
        matchesDate = activityDate >= customStartDate && activityDate <= customEndDate;
      } else {
        matchesDate = dateRange === 'all' || 
          (dateRange === 'today' && activity.timestamp.includes('minutes ago') || activity.timestamp.includes('hours ago')) ||
          (dateRange === 'week' && !activity.timestamp.includes('months ago')) ||
          (dateRange === 'month' && !activity.timestamp.includes('years ago'));
      }

      return matchesSearch && matchesProvider && matchesDate;
    });
  }, [activities, searchTerm, providerFilter, dateRange, customStartDate, customEndDate]);

  // Get paginated activities
  const paginatedActivities = useMemo(() => {
    return filteredActivities.slice(0, page * itemsPerPage);
  }, [filteredActivities, page, itemsPerPage]);

  // Check if there are more activities to load
  const hasMore = filteredActivities.length > paginatedActivities.length;

  // Handle load more click
  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="divide-y divide-gray-200">
        {paginatedActivities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onRemove={() => onActivityRemove(activity.id)}
            isDropdownOpen={activeDropdown === activity.id}
            onToggleDropdown={() => setActiveDropdown(activeDropdown === activity.id ? null : activity.id)}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="p-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading more...
              </span>
            ) : (
              'Load More Activities'
            )}
          </button>
        </div>
      )}

      {!hasMore && filteredActivities.length > 0 && (
        <div className="p-4 text-center text-sm text-gray-500">
          No more activities to load
        </div>
      )}

      {filteredActivities.length === 0 && (
        <div className="p-8 text-center">
          <div className="text-gray-400">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}