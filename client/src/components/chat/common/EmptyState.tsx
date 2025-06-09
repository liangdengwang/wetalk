import React from "react";

interface EmptyStateProps {
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ className = "" }) => {
  return (
    <div
      className={`h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 ${className} transition-colors duration-200`}
    >
      <div className="text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
        <p className="text-xl mb-2">开始聊天</p>
        <p className="text-sm">从左侧列表中选择一个联系人或群聊</p>
      </div>
    </div>
  );
};

export default EmptyState;
