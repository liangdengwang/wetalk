import React from "react";
import { Users, Info, Hash, Bell, Pin, Inbox } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  status: string;
  avatar: string;
}

interface Group {
  id: number;
  name: string;
  avatar: string;
  memberCount: number;
}

interface ChatHeaderProps {
  currentChat: Contact | Group;
  isGroup: boolean;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentChat,
  isGroup,
  className = "",
}) => {
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      case "idle":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center">
        {isGroup ? (
          <>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-3">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center">
                {currentChat.name}
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-normal">
                  {(currentChat as Group).memberCount} 成员
                </span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                欢迎来到 {currentChat.name} 频道
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="relative mr-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                {currentChat.avatar || "U"}
              </div>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(
                  (currentChat as Contact).status
                )}`}
              ></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {currentChat.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(currentChat as Contact).status === "online"
                  ? "在线"
                  : (currentChat as Contact).status === "busy"
                  ? "忙碌中"
                  : (currentChat as Contact).status === "idle"
                  ? "离开"
                  : "离线"}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-150">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-150">
          <Pin className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-150">
          <Users className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-150">
          <Inbox className="w-5 h-5" />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="搜索"
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors duration-150">
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
