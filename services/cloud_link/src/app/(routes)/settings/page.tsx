'use client';

import { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import SettingsHeader from '@/components/settings/SettingsHeader';
import GeneralSettings from '@/components/settings/GeneralSettings';
import StorageSettings from '@/components/settings/StorageSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SettingsTabs from '@/components/settings/SettingsTabs';
import { TabId } from '@/types/settings';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('general');

  const tabs = [
    { id: 'general' as TabId, label: 'General', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
    { id: 'storage' as TabId, label: 'Storage', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
    { id: 'security' as TabId, label: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'notifications' as TabId, label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'storage':
        return <StorageSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      default:
        return null;
    }
  };

  return (
    <SettingsLayout>
      <div className="space-y-6">
        <SettingsHeader 
          title="Settings" 
          description="Manage your account settings and preferences" 
        />
        <SettingsTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        {renderContent()}
      </div>
    </SettingsLayout>
  );
}