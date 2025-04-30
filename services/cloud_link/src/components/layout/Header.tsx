import { useState } from 'react';
import Logo from '@/components/common/Logo';
import MobileSearchButton from '@/components/common/MobileSearchButton';
import NotificationButton from '@/components/common/NotificationButton';
import ActivityButton from '@/components/common/ActivityButton';
import UserDropdown from '@/components/common/UserDropdown';
import Spotlight from '@/components/common/Spotlight';

export default function Header() {
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-48 w-full bg-white border-b border-gray-200 text-sm py-2.5 lg:ps-64">
      <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
        <div className="me-5 lg:me-0 lg:hidden">
          <Logo />
        </div>

        <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
          <div className="hidden md:block">
            <button
              onClick={() => setIsSpotlightOpen(true)}
              className="w-96 flex items-center text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2.5 transition-colors duration-200"
            >
              <svg className="h-4 w-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search files, commands, and accounts...</span>
              <span className="ml-auto text-xs bg-gray-200 px-2 py-0.5 rounded">⌘K</span>
            </button>
          </div>
          <div className="flex flex-row items-center justify-end gap-1">
            <MobileSearchButton onClick={() => setIsSpotlightOpen(true)} />
            <NotificationButton />
            <ActivityButton />
            <UserDropdown />
          </div>
        </div>
      </nav>

      <Spotlight isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} />
    </header>
  );
}