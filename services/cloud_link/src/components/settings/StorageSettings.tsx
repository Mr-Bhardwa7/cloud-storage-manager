'use client';

import { useState } from 'react';
import Image from 'next/image';

interface StorageProvider {
  id: string;
  name: string;
  icon: string;
  syncFrequency: string;
  autoSync: boolean;
}

export default function StorageSettings() {
  const [providers, setProviders] = useState<StorageProvider[]>([
    {
      id: 'gdrive',
      name: 'Google Drive',
      icon: '/google-drive.svg',
      syncFrequency: 'Every 15 minutes',
      autoSync: true
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      icon: '/dropbox.svg',
      syncFrequency: 'Every hour',
      autoSync: false
    }
  ]);

  const [defaultStorage, setDefaultStorage] = useState('Google Drive');
  const [autoCleanup, setAutoCleanup] = useState(false);

  const handleSyncFrequencyChange = (providerId: string, frequency: string) => {
    setProviders(providers.map(provider => 
      provider.id === providerId ? { ...provider, syncFrequency: frequency } : provider
    ));
  };

  const handleAutoSyncChange = (providerId: string, enabled: boolean) => {
    setProviders(providers.map(provider => 
      provider.id === providerId ? { ...provider, autoSync: enabled } : provider
    ));
  };

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Storage Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Configure your storage preferences and limits.</p>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Provider Sync Settings</h4>
            
            {providers.map(provider => (
              <div key={provider.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Image src={provider.icon} alt={provider.name} width={24} height={24} />
                  <h5 className="font-medium">{provider.name}</h5>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-700">Sync Frequency</label>
                    <select 
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={provider.syncFrequency}
                      onChange={(e) => handleSyncFrequencyChange(provider.id, e.target.value)}
                    >
                      <option>Every 15 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Every hour</option>
                      <option>Every 6 hours</option>
                      <option>Daily</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      checked={provider.autoSync}
                      onChange={(e) => handleAutoSyncChange(provider.id, e.target.checked)}
                    />
                    <label className="ml-2 text-sm text-gray-700">Enable auto-sync</label>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Global Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Storage Location</label>
                  <select 
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={defaultStorage}
                    onChange={(e) => setDefaultStorage(e.target.value)}
                  >
                    <option>Google Drive</option>
                    <option>Dropbox</option>
                    <option>OneDrive</option>
                    <option>Amazon S3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Storage Quota</label>
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 rounded-full h-2" style={{ width: '70%' }}></div>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <span>70GB used</span>
                      <span>100GB total</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      checked={autoCleanup}
                      onChange={(e) => setAutoCleanup(e.target.checked)}
                    />
                    <label className="ml-2 block text-sm text-gray-900">Enable auto-cleanup of old files</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}