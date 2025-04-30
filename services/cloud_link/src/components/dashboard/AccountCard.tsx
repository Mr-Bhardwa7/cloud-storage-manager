import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface AccountCardProps {
  name: string;
  icon: string;
  email: string;
  lastSync: string;
  status: string;
  onSync: () => void;
}

export default function AccountCard({ name, icon, email, lastSync, status, onSync }: AccountCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Image src={icon} alt={name} width={24} height={24} className="w-6 h-6" />
          </div>
          <h3 className="font-medium text-gray-900">{name}</h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {status}
        </span>
      </div>
      <div className="space-y-2 mb-6">
        <p className="text-sm text-gray-600">{email}</p>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Last sync: {lastSync}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onSync} className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Sync Now
        </button>
        <div className="relative" ref={optionsRef}>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">
                View Details
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50">
                Edit Account
              </button>
              <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}