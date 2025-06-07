import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, MessageSquarePlus, MessageCircle, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import useChatStore, { ChatItem } from "../../store/chatStore";
import { useUnreadCount } from "../../hooks/useMessages";
import { useUserStore } from "../../store";

interface ChatListProps {
  className?: string;
  style?: React.CSSProperties;
}

const ChatListWithAPI: React.FC<ChatListProps> = ({ className = "", style }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "contacts" | "groups">(
    "all"
  );
  const navigate = useNavigate();
  const { contactId, groupId } = useParams();
  const userStore = useUserStore();
  const userId = userStore.userInfo?.userId;

  // 使用聊天状态管理
  const chatList = useChatStore((state) => state.chatList);
  
  // 使用未读消息数量hook
  const { getBatchUnreadCounts, getCount, clearUnreadCount } = useUnreadCount();

  // 加载未读消息数量
  useEffect(() => {
    if (!userId || chatList.length === 0) return;

    const requests = chatList.map(chat => ({
      key: chat.id,
      ...(chat.isGroup ? { groupId: chat.id } : { otherUserId: chat.id })
    }));

    getBatchUnreadCounts(requests);
  }, [chatList, userId, getBatchUnreadCounts]);

  // 根据搜索关键词和当前标签过滤聊天列表
  const filteredChatList = chatList
    .filter((chat) => {
      // 根据标签过滤
      if (activeTab === "contacts" && chat.isGroup) return false;
      if (activeTab === "groups" && !chat.isGroup) return false;

      // 根据搜索词过滤
      return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // 优先显示有未读消息的聊天
      const aUnread = getCount(a.id);
      const bUnread = getCount(b.id);
      
      if (aUnread > 0 && bUnread === 0) return -1;
      if (aUnread === 0 && bUnread > 0) return 1;

      // 然后按时间排序（这里简化处理，实际应该转换时间格式后比较）
      return 0;
    });

  // 处理聊天项点击
  const handleChatItemClick = (chat: ChatItem) => {
    // 清除未读数量
    clearUnreadCount(chat.id);
    
    // 标记为已读
    useChatStore.getState().markAsRead(chat.id);

    if (chat.isGroup) {
      navigate(`/chat/group/${chat.id}`);
    } else {
      navigate(`/chat/${chat.id}`);
    }
  };

  // 判断聊天项是否处于激活状态
  const isChatActive = (chat: ChatItem) => {
    if (chat.isGroup) {
      return groupId === chat.id.toString();
    } else {
      return contactId === chat.id.toString();
    }
  };

  return (
    <div
      className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      style={style}
    >
      {/* 切换栏 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 py-3 font-medium text-sm transition-colors duration-200 ${
            activeTab === "all"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("all")}
        >
          全部
        </button>
        <button
          className={`flex-1 py-3 font-medium text-sm transition-colors duration-200 ${
            activeTab === "contacts"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("contacts")}
        >
          联系人
        </button>
        <button
          className={`flex-1 py-3 font-medium text-sm transition-colors duration-200 ${
            activeTab === "groups"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("groups")}
        >
          群聊
        </button>
      </div>

      {/* 头部搜索 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索聊天"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
        </div>
      </div>

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatList.length > 0 ? (
          filteredChatList.map((chat) => {
            const unreadCount = getCount(chat.id);
            
            return (
              <motion.div
                key={chat.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  isChatActive(chat) ? "bg-blue-50 dark:bg-blue-900/30" : ""
                }`}
                onClick={() => handleChatItemClick(chat)}
                style={
                  {
                    "--hover-color": document.documentElement.classList.contains(
                      "dark"
                    )
                      ? "#374151"
                      : "#f9fafb",
                    "--tap-color": document.documentElement.classList.contains(
                      "dark"
                    )
                      ? "#1f2937"
                      : "#f3f4f6",
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center">
                  {/* 头像 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${
                      chat.isGroup
                        ? "bg-blue-500 dark:bg-blue-600"
                        : "bg-green-500 dark:bg-green-600"
                    }`}
                  >
                    {chat.avatar ? (
                      <span className="text-sm">{chat.avatar}</span>
                    ) : chat.isGroup ? (
                      <Users size={20} />
                    ) : (
                      <MessageCircle size={20} />
                    )}
                  </div>

                  {/* 聊天信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.time}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
            <p>未找到匹配的聊天</p>
          </div>
        )}
      </div>

      {/* 新建聊天按钮 */}
      <motion.button
        className="m-4 p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{
          scale: 1.05,
          backgroundColor: "var(--hover-color, #2563eb)",
        }}
        whileTap={{ scale: 0.95 }}
        style={
          {
            "--hover-color": document.documentElement.classList.contains("dark")
              ? "#1d4ed8"
              : "#2563eb",
          } as React.CSSProperties
        }
        onClick={() => navigate("/chat/new")}
      >
        <MessageSquarePlus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default ChatListWithAPI; 