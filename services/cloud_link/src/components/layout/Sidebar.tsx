import Logo from '@/components/common/Logo';
import SidebarNav from './SidebarNav';

export default function Sidebar() {
  return (
    <div id="hs-application-sidebar" className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-64 h-full hidden fixed inset-y-0 start-0 z-60 bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0">
      <div className="relative flex flex-col h-full max-h-full">
        <div className="px-6 pt-4 flex items-center">
          <Logo />
        </div>
        <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
          <SidebarNav />
        </div>
      </div>
    </div>
  );
}