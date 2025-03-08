import React, { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import TabBar, { TabItem } from "../common/TabBar";
import SearchBar from "../common/SearchBar";
import ListItem from "../common/ListItem";
import ActionButton from "../common/ActionButton";

interface ContactListProps {
  className?: string;
  style?: React.CSSProperties;
}

// 定义联系人和群聊的接口
interface Contact {
  id: number;
  name: string;
  status: string;
  avatar: string;
}

interface Group {
  id: number;
  name: string;
  members: number;
  avatar: string;
}

type ListItem = Contact | Group;

const ContactList: React.FC<ContactListProps> = ({ className = "", style }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"contacts" | "groups">("contacts");
  const navigate = useNavigate();
  const { contactId, groupId } = useParams();

  // 定义切换栏选项
  const tabs: TabItem[] = [
    { id: "contacts", label: "联系人" },
    { id: "groups", label: "群聊" },
  ];

  // 模拟联系人列表数据
  const contacts: Contact[] = [
    { id: 1, name: "张三", status: "在线", avatar: "张" },
    { id: 2, name: "李四", status: "离线", avatar: "李" },
    { id: 3, name: "王五", status: "忙碌", avatar: "王" },
    { id: 4, name: "赵六", status: "在线", avatar: "赵" },
    { id: 5, name: "钱七", status: "离线", avatar: "钱" },
    { id: 6, name: "孙八", status: "在线", avatar: "孙" },
    { id: 7, name: "周九", status: "离线", avatar: "周" },
    { id: 8, name: "吴十", status: "忙碌", avatar: "吴" },
    { id: 9, name: "郑十一", status: "在线", avatar: "郑" },
    { id: 10, name: "冯十二", status: "离线", avatar: "冯" },
    { id: 11, name: "陈十三", status: "忙碌", avatar: "陈" },
    { id: 12, name: "褚十四", status: "在线", avatar: "褚" },
  ];

  // 模拟群聊列表数据
  const groups: Group[] = [
    { id: 101, name: "产品讨论组", members: 8, avatar: "产" },
    { id: 102, name: "技术交流群", members: 12, avatar: "技" },
    { id: 103, name: "市场营销", members: 6, avatar: "市" },
    { id: 104, name: "客户服务", members: 5, avatar: "客" },
    { id: 105, name: "人力资源", members: 4, avatar: "人" },
    { id: 106, name: "管理层", members: 3, avatar: "管" },
  ];

  // 根据搜索过滤列表
  const filteredContacts = contacts.filter((contact) =>
    contact.name.includes(searchQuery)
  );

  const filteredGroups = groups.filter((group) =>
    group.name.includes(searchQuery)
  );

  // 根据当前选中的标签显示不同的列表
  const displayList: ListItem[] =
    activeTab === "contacts" ? filteredContacts : filteredGroups;

  // 处理列表项点击
  const handleItemClick = (id: number) => {
    if (activeTab === "contacts") {
      navigate(`/contacts/${id}`);
    } else {
      navigate(`/groups/${id}`);
    }
  };

  // 判断是否为联系人类型
  const isContact = (item: ListItem): item is Contact => {
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
                ? contactId === item.id.toString()
                : groupId === item.id.toString();

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

      {/* 添加按钮 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ActionButton
          icon={
            activeTab === "contacts" ? (
              <UserPlus size={20} />
            ) : (
              <Users size={20} />
            )
          }
          label={activeTab === "contacts" ? "添加联系人" : "创建群聊"}
          fullWidth
        />
      </div>
    </div>
  );
};

export default ContactList;
