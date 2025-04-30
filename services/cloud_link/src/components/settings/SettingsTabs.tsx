import { TabId } from '../../types/settings';

interface SettingsTabsProps {
  tabs: Array<{
    id: TabId;
    label: string;
    icon: string;
  }>;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}