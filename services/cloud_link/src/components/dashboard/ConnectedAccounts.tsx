import { useState } from 'react';
import AccountCard from './AccountCard';
import AddAccountCard from './AddAccountCard';

interface ConnectedAccount {
  name: string;
  icon: string;
  email: string;
  lastSync: string;
  status: string;
  type: string;
}

export default function ConnectedAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const connectedAccounts: ConnectedAccount[] = [
    {
      name: 'Google Drive',
      icon: '/google-drive.svg',
      email: 'user@otuclok.co.m',
      lastSync: '2 hours ago',
      status: 'Connected',
      type: 'drive'
    },
    {
      name: 'Dropbox',
      icon: '/dropbox.svg',
      email: 'user@outlook.com',
      lastSync: '1 day ago',
      status: 'Connected',
      type: 'dropbox'
    },
  ];

  const handleSync = (email: string) => {
    console.log('Syncing account:', email);
  };

  const filteredAccounts = connectedAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || account.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Connected Cloud Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">{connectedAccounts.length} accounts connected</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-200 rounded-lg text-sm"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Accounts</option>
            <option value="drive">Google Drive</option>
            <option value="dropbox">Dropbox</option>
            <option value="aws">AWS S3</option>
          </select>
        </div>
      </div>
      
      {/* Grid Container with Pagination */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAccounts.map((account) => (
            <AccountCard
              key={account.email}
              {...account}
              onSync={() => handleSync(account.email)}
            />
          ))}
          <AddAccountCard />
        </div>

        {/* Show when no results found */}
        {filteredAccounts.length === 0 && (
          <div className="flex items-center justify-center gap-3 py-6 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <svg className="size-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-gray-600">No accounts found matching your search criteria</p>
            <button onClick={() => { setSearchQuery(''); setFilter('all'); }} className="text-sm font-medium text-blue-600 hover:text-blue-700">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  );
}