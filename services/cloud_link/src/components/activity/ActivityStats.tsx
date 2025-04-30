interface ActivityStatsProps {
  totalActivities: number;
  totalSynced: number;
  dataTransferred: string;
  activeAccounts: number;
  activityGrowth?: string;
}

export default function ActivityStats({
  totalActivities,
  totalSynced,
  dataTransferred,
  activeAccounts,
  activityGrowth
}: ActivityStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600">Total Activities</div>
          <span className="text-xs text-gray-500">Last 24h</span>
        </div>
        <div className="mt-1 flex items-baseline">
          <div className="text-2xl font-semibold">{totalActivities}</div>
          {activityGrowth && <span className="ml-2 text-sm text-green-600">{activityGrowth}</span>}
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-600">Files Synced Today</div>
        <div className="mt-1 text-2xl font-semibold">{totalSynced}</div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-600">Data Transferred</div>
        <div className="mt-1 text-2xl font-semibold">{dataTransferred}</div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="text-sm font-medium text-gray-600">Active Accounts</div>
        <div className="mt-1 text-2xl font-semibold">{activeAccounts}</div>
      </div>
    </div>
  );
}