import React from "react";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import "../styles/discord.css";
import {
  Hash,
  Users,
  Settings,
  MessageSquare,
  Bell,
  Search,
  Plus,
  Headphones,
  Mic,
} from "lucide-react";

const Layout: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  // 如果是登录页面，直接渲染内容
  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="discord-layout h-screen flex">
      {/* 服务器侧边栏 */}
      <div className="discord-sidebar overflow-y-auto flex flex-col items-center py-3 space-y-2 bg-gray-900 dark:bg-gray-950 w-[72px] flex-shrink-0">
        <div className="discord-server active">
          <span>W</span>
        </div>
        <div className="discord-divider w-8 h-0.5 bg-gray-700 dark:bg-gray-800 rounded-full my-1"></div>
        <div className="discord-server">
          <MessageSquare size={24} />
        </div>
        <div className="discord-server">
          <Users size={24} />
        </div>
        <div className="discord-server">
          <Bell size={24} />
        </div>
        <div className="discord-server">
          <Plus size={24} />
        </div>
        <div className="discord-server">
          <Settings size={24} />
        </div>
      </div>

      {/* 频道列表 */}
      <div className="discord-channel-list flex flex-col bg-gray-800 dark:bg-gray-900 w-60 flex-shrink-0">
        <div className="p-4 shadow-sm border-b border-gray-700 dark:border-gray-800">
          <h2 className="font-bold text-xl text-white">WeTalk</h2>
        </div>

        <div className="p-2">
          <div className="discord-input flex items-center bg-gray-900 dark:bg-gray-800 rounded-md px-2 py-1.5">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="搜索"
              className="bg-transparent border-none outline-none w-full text-sm text-gray-200"
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-2 py-4">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-2 mb-1 uppercase tracking-wider">
              文字频道
            </div>
            <div className="discord-channel active">
              <Hash size={18} className="mr-2 opacity-70" />
              <span>一般聊天</span>
            </div>
            <div className="discord-channel">
              <Hash size={18} className="mr-2 opacity-70" />
              <span>技术交流</span>
            </div>
            <div className="discord-channel">
              <Hash size={18} className="mr-2 opacity-70" />
              <span>产品讨论</span>
            </div>
          </div>

          <div className="px-2 py-4">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-2 mb-1 uppercase tracking-wider">
              语音频道
            </div>
            <div className="discord-channel">
              <Headphones size={18} className="mr-2 opacity-70" />
              <span>语音聊天室</span>
            </div>
          </div>
        </div>

        <div className="mt-auto p-2 bg-gray-700 dark:bg-gray-800 flex items-center">
          <div className="discord-avatar w-8 h-8 mr-2 flex items-center justify-center bg-blue-500 text-white">
            <span className="text-sm font-semibold">我</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">用户名</div>
            <div className="text-xs text-gray-400">#1234</div>
          </div>
          <div className="flex space-x-1">
            <button className="p-1 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 text-gray-400">
              <Mic size={16} />
            </button>
            <button className="p-1 rounded-md hover:bg-gray-600 dark:hover:bg-gray-700 text-gray-400">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="discord-main flex-1 bg-white dark:bg-gray-700 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
