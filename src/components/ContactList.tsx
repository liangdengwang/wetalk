import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, UserPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router";

interface ContactListProps {
  className?: string;
  style?: React.CSSProperties;
}

const ContactList: React.FC<ContactListProps> = ({ className = "", style }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { contactId } = useParams();

  // 模拟联系人列表数据
  const contacts = [
    { id: 1, name: "张三", status: "在线", avatar: "张" },
    { id: 2, name: "李四", status: "离线", avatar: "李" },
    { id: 3, name: "王五", status: "忙碌", avatar: "王" },
    { id: 4, name: "赵六", status: "在线", avatar: "赵" },
    { id: 5, name: "钱七", status: "离线", avatar: "钱" },
    { id: 6, name: "孙八", status: "在线", avatar: "孙" },
    { id: 7, name: "周九", status: "离线", avatar: "周" },
    { id: 8, name: "吴十", status: "忙碌", avatar: "吴" },
  ];

  // 根据搜索关键词过滤联系人
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            placeholder="搜索联系人"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* 联系人列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                contactId === contact.id.toString() ? "bg-blue-50" : ""
              }`}
              whileHover={{ backgroundColor: "#f9fafb" }}
              whileTap={{ backgroundColor: "#f3f4f6" }}
              onClick={() => navigate(`/contacts/${contact.id}`)}
            >
              <div className="flex items-center">
                {/* 头像 */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${
                    contact.status === "在线"
                      ? "bg-green-500"
                      : contact.status === "忙碌"
                      ? "bg-orange-500"
                      : "bg-gray-400"
                  }`}
                >
                  {contact.avatar}
                </div>

                {/* 联系人信息 */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">
                      {contact.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        contact.status === "在线"
                          ? "bg-green-100 text-green-800"
                          : contact.status === "忙碌"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <p>未找到匹配的联系人</p>
          </div>
        )}
      </div>

      {/* 添加联系人按钮 */}
      <motion.button
        className="m-4 p-3 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
        whileTap={{ scale: 0.95 }}
      >
        <UserPlus className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default ContactList;
