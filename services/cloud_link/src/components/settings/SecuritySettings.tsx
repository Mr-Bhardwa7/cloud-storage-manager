'use client';

import { useState } from 'react';

export default function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [deviceSessions] = useState([
    { device: 'Windows PC', location: 'London, UK', lastActive: 'Active now', browser: 'Chrome' },
    { device: 'iPhone 13', location: 'Paris, FR', lastActive: '2 hours ago', browser: 'Safari' },
    { device: 'MacBook Pro', location: 'New York, US', lastActive: '1 day ago', browser: 'Firefox' }
  ]);

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div className="p-6">
        <div className="space-y-6">
          {/* 2FA Section */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="mt-1 text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  twoFactorEnabled
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="w-32 h-32 bg-gray-200" /> {/* QR Code placeholder */}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">Setup Instructions</h4>
                    <ol className="mt-2 text-sm text-gray-600 space-y-2">
                      <li>1. Download an authenticator app</li>
                      <li>2. Scan the QR code</li>
                      <li>3. Enter the verification code</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Sessions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your active sessions across devices</p>
            <div className="mt-4 space-y-3">
              {deviceSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-500">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d={session.device.includes('iPhone') 
                            ? "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            : "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"} 
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{session.device}</p>
                      <p className="text-xs text-gray-500">{session.browser} • {session.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-500">{session.lastActive}</span>
                    {session.lastActive !== 'Active now' && (
                      <button className="text-sm text-red-600 hover:text-red-700">
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Log */}
          <div>
            <h3 className="text-lg font-medium text-gray-900">Security Log</h3>
            <p className="mt-1 text-sm text-gray-500">Recent security-related activity on your account</p>
            <div className="mt-4 space-y-3">
              {[
                { event: 'New login from Chrome', location: 'London, UK', time: '2 minutes ago' },
                { event: 'Password changed', location: 'London, UK', time: '2 days ago' },
                { event: '2FA enabled', location: 'London, UK', time: '5 days ago' }
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.event}</p>
                    <p className="text-xs text-gray-500">{log.location}</p>
                  </div>
                  <span className="text-xs text-gray-500">{log.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}