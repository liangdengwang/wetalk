import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Plus } from "lucide-react";

interface ChatListProps {
  className?: string;
  style?: React.CSSProperties;
}

const ChatList: React.FC<ChatListProps> = ({ className = "", style }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // 模拟聊天列表数据
  const chatList = [
    {
      id: 1,
      name: "张三",
      lastMessage: "你好，最近怎么样？",
      time: "10:30",
      unread: 2,
    },
    {
      id: 2,
      name: "李四",
      lastMessage: "项目进展如何？",
      time: "昨天",
      unread: 0,
    },
    {
      id: 3,
      name: "王五",
      lastMessage: "周末有空一起吃饭吗？",
      time: "周三",
      unread: 0,
    },
    {
      id: 4,
      name: "技术群",
      lastMessage: "[文件] 项目文档.pdf",
      time: "周一",
      unread: 5,
    },
  ];

  return (
    <div
      className={`h-full flex flex-col border-r border-gray-200 ${className}`}
      style={style}
    >
      {/* 头部搜索 */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto">
        {chatList.map((chat) => (
          <motion.div
            key={chat.id}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            whileHover={{ backgroundColor: "#f9fafb" }}
            whileTap={{ backgroundColor: "#f3f4f6" }}
          >
            <div className="flex items-center">
              {/* 头像 */}
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mr-3">
                {chat.name.charAt(0)}
              </div>

              {/* 聊天信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 truncate">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 新建聊天按钮 */}
      <motion.button
        className="m-4 p-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
        whileTap={{ scale: 0.95 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default ChatList;
