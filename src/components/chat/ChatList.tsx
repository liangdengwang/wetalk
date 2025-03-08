import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import TabBar, { TabItem } from "../common/TabBar";
import SearchBar from "../common/SearchBar";
import ListItem from "../common/ListItem";
import ActionButton from "../common/ActionButton";

interface ChatListProps {
  className?: string;
  style?: React.CSSProperties;
}

// 定义聊天项接口
interface ChatItem {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ className = "", style }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "contacts" | "groups">(
    "all"
  );
  const navigate = useNavigate();
  const { contactId, groupId } = useParams();

  // 定义切换栏选项
  const tabs: TabItem[] = [
    { id: "all", label: "全部" },
    { id: "contacts", label: "联系人" },
    { id: "groups", label: "群聊" },
  ];

  // 模拟聊天列表数据
  const chatList: ChatItem[] = [
    {
      id: 1,
      name: "张三",
      lastMessage: "你好，最近怎么样？",
      time: "10:30",
      unread: 2,
      avatar: "张",
      isGroup: false,
    },
    {
      id: 2,
      name: "李四",
      lastMessage: "项目进展如何？",
      time: "昨天",
      unread: 0,
      avatar: "李",
      isGroup: false,
    },
    {
      id: 3,
      name: "王五",
      lastMessage: "周末有空一起吃饭吗？",
      time: "周三",
      unread: 0,
      avatar: "王",
      isGroup: false,
    },
    {
      id: 101,
      name: "技术交流群",
      lastMessage: "李四: 你需要在父路由组件中添加<Outlet />组件。",
      time: "09:40",
      unread: 5,
      avatar: "技",
      isGroup: true,
    },
    {
      id: 102,
      name: "产品讨论组",
      lastMessage: "孙八: 同意，注册流程太复杂了。",
      time: "14:30",
      unread: 0,
      avatar: "产",
      isGroup: true,
    },
    {
      id: 4,
      name: "赵六",
      lastMessage: "收到，我待会儿看看。",
      time: "09:22",
      unread: 0,
      avatar: "赵",
      isGroup: false,
    },
    {
      id: 103,
      name: "市场营销部",
      lastMessage: "李四: 不超过5万元。",
      time: "11:30",
      unread: 3,
      avatar: "市",
      isGroup: true,
    },
  ];

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
      if (a.unread > 0 && b.unread === 0) return -1;
      if (a.unread === 0 && b.unread > 0) return 1;

      // 然后按时间排序（这里简化处理，实际应该转换时间格式后比较）
      return 0;
    });

  // 处理聊天项点击
  const handleChatItemClick = (chat: ChatItem) => {
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

  // 处理标签切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as "all" | "contacts" | "groups");
  };

  return (
    <div
      className={`h-full flex flex-col border-r border-gray-200 ${className}`}
      style={style}
    >
      {/* 切换栏 */}
      <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* 搜索框 */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="搜索聊天"
      />

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatList.length > 0 ? (
          filteredChatList.map((chat) => (
            <ListItem
              key={chat.id}
              avatar={chat.avatar}
              avatarColor={chat.isGroup ? "bg-blue-500" : "bg-green-500"}
              title={chat.name}
              subtitle={chat.lastMessage}
              rightText={chat.time}
              rightBadge={chat.unread}
              isActive={isChatActive(chat)}
              onClick={() => handleChatItemClick(chat)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p>未找到匹配的聊天</p>
          </div>
        )}
      </div>

      {/* 新建聊天按钮 */}
      <div className="p-4">
        <ActionButton
          icon={<Plus className="w-6 h-6" />}
          color="primary"
          className="ml-auto"
        />
      </div>
    </div>
  );
};

export default ChatList;
