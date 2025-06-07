import React, { useState } from "react";
import { UserPlus, Users, Inbox } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import TabBar, { TabItem } from "../common/TabBar";
import SearchBar from "../common/SearchBar";
import ListItem from "../common/ListItem";
import ActionButton from "../common/ActionButton";
import AddFriendModal from "./AddFriendModal";
import FriendRequestsModal from "./FriendRequestsModal";
import { Contact as ContactType } from "../../utils/contact";
import { Group as GroupType } from "../../utils/group";
import { useFriends } from "../../hooks/useFriends";
import { Friend } from "../../utils/friend";

interface ContactListProps {
  className?: string;
  style?: React.CSSProperties;
  contacts?: ContactType[]; // 从API获取的联系人列表
  groups?: GroupType[]; // 从API获取的群组列表
  loading?: boolean; // 联系人加载状态
  groupsLoading?: boolean; // 群组加载状态
  error?: string | null; // 联系人错误信息
  groupsError?: string | null; // 群组错误信息
}

type ListItem = ContactType | GroupType;

const ContactList: React.FC<ContactListProps> = ({
  className = "",
  style,
  contacts = [], // 默认为空数组
  groups = [], // 默认为空数组
  loading = false,
  groupsLoading = false,
  error = null,
  groupsError = null,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showFriendRequestsModal, setShowFriendRequestsModal] = useState(false);
  const navigate = useNavigate();
  const { contactId, groupId } = useParams();
  
  // 使用好友管理Hook
  const { friends, loading: friendsLoading, error: friendsError, loadFriends } = useFriends();

  // 定义切换栏选项
  const tabs: TabItem[] = [
    { id: "contacts", label: "联系人" },
    { id: "groups", label: "群聊" },
  ];

  // 将Friend转换为Contact格式
  const convertFriendsToContacts = (friends: Friend[]): ContactType[] => {
    // 确保friends是数组
    if (!Array.isArray(friends)) {
      return [];
    }
    return friends.map(friend => ({
      id: friend.id,
      name: friend.username,
      avatar: friend.avatar || friend.username.charAt(0),
      status: friend.status || "离线"
    }));
  };

  // 合并传入的联系人和好友列表
  const allContacts = [
    ...contacts,
    ...convertFriendsToContacts(friends || [])
  ].filter((contact, index, self) => 
    // 去重，以id为准
    index === self.findIndex(c => c.id === contact.id)
  );

  // 根据搜索过滤列表
  const filteredContacts = allContacts.filter((contact) =>
    contact.name.includes(searchQuery)
  );

  const filteredGroups = groups.filter((group) =>
    group.name.includes(searchQuery)
  );

  // 根据当前选中的标签显示不同的列表
  const displayList: ListItem[] =
    activeTab === "contacts" ? filteredContacts : filteredGroups;

  // 处理列表项点击
  const handleItemClick = (id: string) => {
    if (activeTab === "contacts") {
      navigate(`/contacts/${id}`);
    } else {
      navigate(`/groups/${id}`);
    }
  };

  // 判断是否为联系人类型
  const isContact = (item: ListItem): item is ContactType => {
    return "status" in item;
  };

  // 根据状态获取颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case "在线":
        return "bg-green-500 dark:bg-green-600";
      case "离线":
        return "bg-gray-400 dark:bg-gray-500";
      case "忙碌":
        return "bg-orange-500 dark:bg-orange-600";
      default:
        return "bg-gray-400 dark:bg-gray-500";
    }
  };

  // 处理标签切换
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as "contacts" | "groups");
  };

  // 渲染加载状态 - 联系人（包括好友加载）
  if ((loading || friendsLoading) && activeTab === "contacts") {
    return (
      <div
        className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      >
        <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        <div className="flex-1 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
        </div>
      </div>
    );
  }

  // 渲染加载状态 - 群组
  if (groupsLoading && activeTab === "groups") {
    return (
      <div
        className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      >
        <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        <div className="flex-1 flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
        </div>
      </div>
    );
  }

  // 渲染错误状态 - 联系人（包括好友错误）
  if ((error || friendsError) && activeTab === "contacts") {
    return (
      <div
        className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      >
        <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-red-500 text-center">
            <p className="text-lg font-bold mb-2">出错了</p>
            <p>{error || friendsError}</p>
          </div>
        </div>
      </div>
    );
  }

  // 渲染错误状态 - 群组
  if (groupsError && activeTab === "groups") {
    return (
      <div
        className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      >
        <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-red-500 text-center">
            <p className="text-lg font-bold mb-2">出错了</p>
            <p>{groupsError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      style={style}
    >
      {/* 标签栏 */}
      <TabBar tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      {/* 搜索框 */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={activeTab === "contacts" ? "搜索联系人" : "搜索群聊"}
      />

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto">
        {displayList.length > 0 ? (
          displayList.map((item) => {
            const isActive =
              activeTab === "contacts"
                ? contactId === item.id
                : groupId === item.id;

            if (isContact(item)) {
              // 联系人项
              return (
                <ListItem
                  key={item.id}
                  avatar={item.avatar}
                  avatarColor={getStatusColor(item.status)}
                  title={item.name}
                  rightText={item.status}
                  isActive={isActive}
                  onClick={() => handleItemClick(item.id)}
                />
              );
            } else {
              // 群聊项
              return (
                <ListItem
                  key={item.id}
                  avatar={item.avatar}
                  avatarColor="bg-blue-500 dark:bg-blue-600"
                  title={item.name}
                  rightText={`${item.members}人`}
                  isActive={isActive}
                  onClick={() => handleItemClick(item.id)}
                />
              );
            }
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
            <p>未找到匹配的{activeTab === "contacts" ? "联系人" : "群聊"}</p>
          </div>
        )}
      </div>

      {/* 底部操作区域 */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {activeTab === "contacts" && (
          <div className="p-4 space-y-3">
            {/* 好友请求入口 */}
            <ActionButton
              icon={<Inbox size={20} />}
              label="好友请求"
              fullWidth
              onClick={() => setShowFriendRequestsModal(true)}
            />
            {/* 添加好友按钮 */}
            <ActionButton
              icon={<UserPlus size={20} />}
              label="添加好友"
              fullWidth
              onClick={() => setShowAddFriendModal(true)}
            />
          </div>
        )}
        {activeTab === "groups" && (
          <div className="p-4">
            <ActionButton
              icon={<Users size={20} />}
              label="创建群聊"
              fullWidth
            />
          </div>
        )}
      </div>

      {/* 弹窗组件 */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        onSuccess={() => {
          // 好友请求发送成功后可以刷新相关数据
          console.log('好友请求发送成功');
        }}
      />
      
      <FriendRequestsModal
        isOpen={showFriendRequestsModal}
        onClose={() => setShowFriendRequestsModal(false)}
        onSuccess={() => {
          // 好友请求处理成功后刷新好友列表
          loadFriends();
        }}
      />
    </div>
  );
};

export default ContactList;
