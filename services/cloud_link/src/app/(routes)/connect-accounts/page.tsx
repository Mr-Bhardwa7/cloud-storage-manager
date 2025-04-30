'use client';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileBreadcrumb from '@/components/layout/MobileBreadcrumb';
import Image from 'next/image';
import { useState } from 'react';

const cloudServices = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: '/google-drive.svg',
    description: 'Connect your Google Drive account to sync and manage files.',
    popular: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '/dropbox.svg',
    description: 'Link your Dropbox account for seamless file management.',
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    icon: '/onedrive.svg',
    description: 'Integrate with OneDrive for business and personal storage.',
  },
  {
    id: 'aws-s3',
    name: 'Amazon S3',
    icon: '/aws-s3.svg',
    description: 'Connect to AWS S3 buckets for cloud storage solutions.',
  }
];

export default function ConnectAccounts() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (serviceId: string) => {
    setConnecting(serviceId);
    setTimeout(() => setConnecting(null), 2000);
  };

  return (
    <>
      <Header />
      <div className="-mt-px">
        <MobileBreadcrumb 
          items={[
            { label: 'Application Layout', href: '#' },
            { label: 'Connect Accounts', href: '#', current: true }
          ]} 
        />
      </div>
      <Sidebar />
      <div className="w-full lg:ps-64">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Connect Cloud Storage</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">Choose a cloud storage provider to connect and start managing your files across multiple platforms in one place.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {cloudServices.map((service) => (
              <div
                key={service.id}
                className="group relative p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                {service.popular && (
                  <span className="absolute -top-3 -right-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-medium rounded-full shadow-sm">
                    Popular Choice
                  </span>
                )}
                
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Image src={service.icon} alt={service.name} width={40} height={40} className="w-10 h-10" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{service.name}</h3>
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{service.description}</p>
                    </div>
                    <button
                      onClick={() => handleConnect(service.id)}
                      disabled={connecting === service.id}
                      className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 ${
                        connecting === service.id
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow'
                      } transition-all duration-300`}
                    >
                      {!connecting && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {connecting === service.id ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Connecting...
                        </span>
                      ) : (
                        'Quick Connect'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
