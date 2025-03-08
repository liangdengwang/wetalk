import React from "react";

export interface TabItem {
  id: string;
  label: string;
}

interface TabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
}) => {
  return (
    <div
      className={`flex border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 py-3 font-medium text-sm transition-colors duration-200 ${
            activeTab === tab.id
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
