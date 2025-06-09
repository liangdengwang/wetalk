import React, { ReactNode } from "react";

interface BaseSettingLayoutProps {
  className?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

const BaseSettingLayout: React.FC<BaseSettingLayoutProps> = ({
  className = "",
  title,
  children,
  footer,
}) => {
  return (
    <div
      className={`h-full flex flex-col bg-white dark:bg-gray-800 ${className}`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {footer && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

export default BaseSettingLayout;
