import { useState } from 'react';
import Image from 'next/image';

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  account: string;
  icon: string;
  status?: 'success' | 'pending' | 'error';
  details?: string;
}

export default function RecentActivity() {
  const [filter, setFilter] = useState<'all' | 'success' | 'error' | 'pending'>('all');
  const [showAll, setShowAll] = useState(false);

  const activities: Activity[] = [
    {
      id: '1',
      action: 'Synced with Google Drive',
      timestamp: '3 hours ago',
      account: 'work@gmail.com',
      icon: '/google-drive.svg',
      status: 'success',
      details: 'Successfully synced 156 files'
    },
    {
      id: '2',
      action: 'Linked S3 bucket successfully',
      timestamp: 'Yesterday',
      account: 'AWS Account',
      icon: '/aws-s3.svg',
      status: 'success'
    },
    {
      id: '3',
      action: 'Dropbox disconnected',
      timestamp: '2 days ago',
      account: 'user@outlook.com',
      icon: '/dropbox.svg',
      status: 'error'
    },
    {
      id: '4',
      action: 'Backup in progress',
      timestamp: 'Just now',
      account: 'personal@outlook.com',
      icon: '/onedrive.svg',
      status: 'pending',
      details: 'Backing up Documents folder'
    }
  ];

  const filteredActivities = activities.filter(
    activity => filter === 'all' || activity.status === filter
  );

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 5);

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
          >
            <option value="all">All Activities</option>
            <option value="success">Successful</option>
            <option value="error">Failed</option>
            <option value="pending">In Progress</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {displayedActivities.map((activity) => (
          <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                <Image src={activity.icon} alt="" width={20} height={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.action}
                  </p>
                  {activity.status && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'success' ? 'bg-green-100 text-green-800' :
                      activity.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {activity.account}
                </p>
                {activity.details && (
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.details}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length > 5 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show Less' : `Show ${filteredActivities.length - 5} More Activities`}
          </button>
        </div>
      )}

      {filteredActivities.length === 0 && (
        <div className="px-6 py-8 text-center">
          <p className="text-gray-500">No activities found</p>
        </div>
      )}
    </section>
  );
}