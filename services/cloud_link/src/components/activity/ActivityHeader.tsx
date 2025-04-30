import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ActivityHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  providerFilter: string;
  onProviderFilterChange: (value: string) => void;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  customStartDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  customEndDate: Date | null;
  onEndDateChange: (date: Date | null) => void;
}

export default function ActivityHeader({
  searchTerm,
  onSearchChange,
  providerFilter,
  onProviderFilterChange,
  dateRange,
  onDateRangeChange,
  customStartDate,
  onStartDateChange,
  customEndDate,
  onEndDateChange
}: ActivityHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
        <p className="mt-1 text-sm text-gray-500">Track all your cloud storage activities across providers</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select
          value={providerFilter}
          onChange={(e) => onProviderFilterChange(e.target.value)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
        >
          <option value="all">All Providers</option>
          <option value="google">Google</option>
          <option value="dropbox">Dropbox</option>
          <option value="microsoft">Microsoft</option>
          <option value="aws">AWS</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>

        {dateRange === 'custom' && (
          <div className="flex gap-2 items-center">
            <DatePicker
              selected={customStartDate}
              onChange={(date) => {
                onStartDateChange(date);
                if (date && customEndDate) {
                  // Reset end date if it's before start date
                  if (customEndDate < date) {
                    onEndDateChange(null);
                  }
                }
              }}
              selectsStart
              startDate={customStartDate}
              endDate={customEndDate}
              placeholderText="Start Date"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
            <span>to</span>
            <DatePicker
              selected={customEndDate}
              onChange={(date) => {
                onEndDateChange(date);
                if (!customStartDate && date) {
                  // If end date is selected first, set start date to beginning of the day
                  onStartDateChange(new Date(date.setHours(0, 0, 0, 0)));
                }
              }}
              selectsEnd
              startDate={customStartDate}
              endDate={customEndDate}
              minDate={customStartDate || undefined}
              placeholderText="End Date"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}