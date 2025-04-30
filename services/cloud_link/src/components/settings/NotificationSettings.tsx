'use client';

import { useState } from 'react';

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationPreference {
  id: string;
  category: string;
  label: string;
  description: string;
  channels: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

export default function NotificationSettings() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: true
    },
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Get notifications on your mobile device',
      enabled: true
    },
    {
      id: 'desktop',
      label: 'Desktop Notifications',
      description: 'Receive notifications on your computer',
      enabled: false
    }
  ]);

  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'security',
      category: 'Security',
      label: 'Security Alerts',
      description: 'Login attempts, security updates, and suspicious activity',
      channels: { email: true, push: true, desktop: true }
    },
    {
      id: 'storage',
      category: 'Storage',
      label: 'Storage Alerts',
      description: 'Storage quota updates and cleanup recommendations',
      channels: { email: true, push: false, desktop: true }
    },
    {
      id: 'sharing',
      category: 'Collaboration',
      label: 'File Sharing',
      description: 'When files are shared with you or access changes',
      channels: { email: true, push: true, desktop: false }
    },
    {
      id: 'sync',
      category: 'Sync',
      label: 'Sync Status',
      description: 'File sync completion and errors',
      channels: { email: false, push: true, desktop: true }
    }
  ]);

  const toggleChannel = (channelId: string) => {
    setChannels(channels.map(channel =>
      channel.id === channelId ? { ...channel, enabled: !channel.enabled } : channel
    ));
  };

  const togglePreference = (prefId: string, channelType: keyof NotificationPreference['channels']) => {
    setPreferences(preferences.map(pref =>
      pref.id === prefId
        ? {
            ...pref,
            channels: {
              ...pref.channels,
              [channelType]: !pref.channels[channelType]
            }
          }
        : pref
    ));
  };

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
        <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications.</p>

        {/* Notification Channels */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Notification Channels</h4>
          <div className="mt-4 space-y-4">
            {channels.map(channel => (
              <div key={channel.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h5 className="text-sm font-medium text-gray-900">{channel.label}</h5>
                    {channel.enabled && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Enabled
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => toggleChannel(channel.id)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      channel.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        channel.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-900">Notification Preferences</h4>
          <div className="mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="py-3 text-left text-sm font-medium text-gray-900">Type</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-900">Email</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-900">Push</th>
                  <th className="px-3 py-3 text-center text-sm font-medium text-gray-900">Desktop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {preferences.map(pref => (
                  <tr key={pref.id}>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{pref.label}</p>
                        <p className="text-sm text-gray-500">{pref.description}</p>
                      </div>
                    </td>
                    {Object.entries(pref.channels).map(([channel, enabled]) => (
                      <td key={channel} className="px-3 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => togglePreference(pref.id, channel as keyof NotificationPreference['channels'])}
                          disabled={!channels.find(c => c.id === channel)?.enabled}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Save Preferences
        </button>
      </div>
    </div>
  );
}