import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MobileBreadcrumb from '@/components/layout/MobileBreadcrumb';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <Header />
      <MobileBreadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings', current: true }
        ]}
      />
      <Sidebar />
      <div className="w-full lg:ps-64">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </>
  );
}