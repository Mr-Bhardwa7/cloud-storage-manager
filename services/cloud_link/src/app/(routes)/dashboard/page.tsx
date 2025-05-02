'use client';

import { useAppSelector } from '@/store/hooks';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileBreadcrumb from '@/components/layout/MobileBreadcrumb';
import ConnectedAccounts from '@/components/dashboard/ConnectedAccounts';
import RecentActivity from '@/components/dashboard/RecentActivity';
import NoAccountBanner from '@/components/dashboard/NoAccountBanner';

export default function DashboardPage() {
  const hasAccounts = false;
  const { user } = useAppSelector((state) => state.user);
  
  // Get user's initials for the avatar
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Header />
      <div className="-mt-px">
        <MobileBreadcrumb 
          items={[
            { label: 'Account', href: '#' },
            { label: 'Dashboard', href: '#', current: true }
          ]} 
        />
      </div>
      <Sidebar />
      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-blue-600">{getInitials()}</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-sm text-gray-500">Last login: Today at 9:42 AM</p>
              </div>
            </div>
            {
              hasAccounts && (
                 <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Storage Used</p>
                    <p className="text-xs text-gray-500">45.5 GB of 100 GB</p>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '45.5%' }}></div>
                  </div>
                </div>
              )
           }
          </div>
          {!hasAccounts ? (
              <NoAccountBanner />
            ) : (
              <>
                <ConnectedAccounts />
                <RecentActivity />
              </>
            )}
        </div>
      </div>
    </>
  );
}
