'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileBreadcrumb from '@/components/layout/MobileBreadcrumb';
import ActivityHeader from '@/components/activity/ActivityHeader';
import ActivityStats from '@/components/activity/ActivityStats';
import ActivityList from '@/components/activity/ActivityList';
import { Activity } from '@/types/activity';

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  // Load activities from localStorage
  useEffect(() => {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  // Calculate stats
  const stats = {
    totalActivities: activities.length,
    totalSynced: activities.filter(a => a.type === 'sync').length,
    dataTransferred: activities.reduce((total, a) => total + (parseInt(a.details?.size || '0') || 0), 0),
    activeAccounts: new Set(activities.map(a => a.account.email)).size
  };

  const handleActivityRemove = (activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  // Add custom date states
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  return (
    <>
      <Header />
      <MobileBreadcrumb 
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Activity Log', href: '/activity', current: true }
        ]} 
      />
      <Sidebar />
      <div className="w-full lg:ps-64">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <ActivityHeader 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              providerFilter={providerFilter}
              onProviderFilterChange={setProviderFilter}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              customStartDate={customStartDate}
              onStartDateChange={setCustomStartDate}
              customEndDate={customEndDate}
              onEndDateChange={setCustomEndDate}
            />
            <ActivityStats 
              totalActivities={stats.totalActivities}
              totalSynced={stats.totalSynced}
              dataTransferred={`${(stats.dataTransferred / (1024 * 1024 * 1024)).toFixed(1)} GB`}
              activeAccounts={stats.activeAccounts}
              activityGrowth="+12.5%"
            />
          </div>

          <ActivityList 
            activities={activities}
            searchTerm={searchTerm}
            providerFilter={providerFilter}
            dateRange={dateRange}
            onActivityRemove={handleActivityRemove}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onStartDateChange={setCustomStartDate}
            onEndDateChange={setCustomEndDate}
          />
        </div>
      </div>
    </>
  );
}

// Default activities data
const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'sync',
    title: 'Bulk Sync Completed',
    description: 'Synchronized multiple folders from Work Drive',
    timestamp: '2 minutes ago',
    account: {
      name: 'Google Drive',
      icon: '/google-drive.svg',
      email: 'work@company.com',
      type: 'drive',
      provider: 'google'
    },
    details: {
      affectedFiles: 128,
      size: '1.2 GB',
      duration: '45 seconds',
      path: '/Work Documents/Projects',
      changes: {
        added: 45,
        modified: 82,
        deleted: 1
      }
    },
    status: 'success',
    priority: 'medium'
  },
  {
    id: '2',
    type: 'error',
    title: 'Sync Failed',
    description: 'Unable to sync files with Dropbox',
    timestamp: '30 minutes ago',
    account: {
      name: 'Dropbox',
      icon: '/dropbox.svg',
      email: 'team@company.com',
      type: 'dropbox',
      provider: 'dropbox'
    },
    details: {
      errorDetails: 'Network timeout after 30 seconds',
      path: '/Team Projects',
      affectedFiles: 23
    },
    status: 'error',
    priority: 'high'
  },
  {
    id: '3',
    type: 'upload',
    title: 'Project Files Uploaded',
    description: 'Successfully uploaded design assets',
    timestamp: '1 hour ago',
    account: {
      name: 'OneDrive',
      icon: '/onedrive.svg',
      email: 'design@company.com',
      type: 'onedrive',
      provider: 'microsoft'
    },
    details: {
      size: '456 MB',
      path: '/Design Assets/Q4 2023',
      affectedFiles: 15
    },
    status: 'success',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'share',
    title: 'Shared Folder Access Updated',
    description: 'Modified permissions for Marketing team',
    timestamp: '2 hours ago',
    account: {
      name: 'Google Drive',
      icon: '/google-drive.svg',
      email: 'marketing@company.com',
      type: 'drive',
      provider: 'google'
    },
    details: {
      path: '/Marketing/Campaigns',
      sharedWith: ['team@company.com', 'agency@partner.com']
    },
    status: 'success',
    priority: 'low'
  },
  {
    id: '5',
    type: 'delete',
    title: 'Cleaned Old Backups',
    description: 'Removed outdated backup files',
    timestamp: '3 hours ago',
    account: {
      name: 'Amazon S3',
      icon: '/storage-cleanup.svg',
      email: 'admin@company.com',
      type: 's3',
      provider: 'aws'
    },
    details: {
      path: '/backups/2023/Q2',
      affectedFiles: 45,
      size: '2.3 GB'
    },
    status: 'success',
    priority: 'low'
  },
  {
    id: '6',
    type: 'connection',
    title: 'New Storage Connected',
    description: 'Successfully linked new S3 bucket',
    timestamp: '4 hours ago',
    account: {
      name: 'Amazon S3',
      icon: '/s3.svg',
      email: 'admin@company.com',
      type: 's3',
      provider: 'aws'
    },
    status: 'success',
    priority: 'medium'
  },
  {
    id: '7',
    type: 'permission',
    title: 'Access Request Approved',
    description: 'Granted read access to development team',
    timestamp: '5 hours ago',
    account: {
      name: 'Dropbox',
      icon: '/dropbox.svg',
      email: 'dev@company.com',
      type: 'dropbox',
      provider: 'dropbox'
    },
    details: {
      path: '/Development/APIs',
      sharedWith: ['dev-team@company.com']
    },
    status: 'success',
    priority: 'medium'
  },
  {
    id: '8',
    type: 'rename',
    title: 'Folder Structure Updated',
    description: 'Reorganized project folders',
    timestamp: '6 hours ago',
    account: {
      name: 'OneDrive',
      icon: '/onedrive.svg',
      email: 'pm@company.com',
      type: 'onedrive',
      provider: 'microsoft'
    },
    details: {
      path: '/Projects/2023',
      affectedFiles: 67
    },
    status: 'success',
    priority: 'low'
  }
];