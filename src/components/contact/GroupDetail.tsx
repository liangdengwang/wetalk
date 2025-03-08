import React from "react";
import { motion } from "motion/react";
import { useParams } from "react-router";
import {
  MessageSquare,
  Phone,
  Video,
  Trash2,
  UserPlus,
  Settings,
} from "lucide-react";

interface GroupDetailProps {
  className?: string;
}

const GroupDetail: React.FC<GroupDetailProps> = ({ className = "" }) => {
  const { groupId } = useParams();

  // 模拟群聊数据
  const groups = [
    {
      id: 101,
      name: "产品讨论组",
      avatar: "产",
      description: "讨论产品需求和功能规划的群组",
      createdAt: "2023-01-15",
      members: [
        { id: 1, name: "张三", role: "群主", avatar: "张", status: "在线" },
        { id: 2, name: "李四", role: "管理员", avatar: "李", status: "离线" },
        { id: 3, name: "王五", role: "成员", avatar: "王", status: "忙碌" },
        { id: 4, name: "赵六", role: "成员", avatar: "赵", status: "在线" },
        { id: 5, name: "钱七", role: "成员", avatar: "钱", status: "离线" },
        { id: 6, name: "孙八", role: "成员", avatar: "孙", status: "在线" },
        { id: 7, name: "周九", role: "成员", avatar: "周", status: "离线" },
        { id: 8, name: "吴十", role: "成员", avatar: "吴", status: "忙碌" },
      ],
    },
    {
      id: 102,
      name: "技术交流群",
      avatar: "技",
      description: "讨论技术问题和分享技术文章的群组",
      createdAt: "2023-02-20",
      members: [
        { id: 1, name: "张三", role: "群主", avatar: "张", status: "在线" },
        { id: 2, name: "李四", role: "管理员", avatar: "李", status: "离线" },
        { id: 3, name: "王五", role: "成员", avatar: "王", status: "忙碌" },
        { id: 9, name: "郑十一", role: "成员", avatar: "郑", status: "在线" },
        { id: 10, name: "冯十二", role: "成员", avatar: "冯", status: "离线" },
        { id: 11, name: "陈十三", role: "成员", avatar: "陈", status: "忙碌" },
        { id: 12, name: "褚十四", role: "成员", avatar: "褚", status: "在线" },
      ],
    },
    {
      id: 103,
      name: "市场营销",
      avatar: "市",
      description: "讨论市场策略和营销活动的群组",
      createdAt: "2023-03-10",
      members: [
        { id: 1, name: "张三", role: "群主", avatar: "张", status: "在线" },
        { id: 4, name: "赵六", role: "管理员", avatar: "赵", status: "在线" },
        { id: 5, name: "钱七", role: "成员", avatar: "钱", status: "离线" },
        { id: 9, name: "郑十一", role: "成员", avatar: "郑", status: "在线" },
        { id: 10, name: "冯十二", role: "成员", avatar: "冯", status: "离线" },
        { id: 11, name: "陈十三", role: "成员", avatar: "陈", status: "忙碌" },
      ],
    },
  ];

  // 根据ID查找当前群聊
  const currentGroup = groups.find((group) => group.id.toString() === groupId);

  // 如果没有找到群聊，显示空状态
  if (!currentGroup) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 ${className}`}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-xl mb-2">请选择一个群聊</p>
          <p className="text-sm">从左侧列表中选择一个群聊查看详情</p>
        </div>
      </div>
    );
  }

  // 获取状态对应的颜色
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

  // 获取角色对应的颜色
  const getRoleColor = (role: string) => {
    switch (role) {
      case "群主":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "管理员":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div
      className={`h-full flex flex-col bg-white dark:bg-gray-800 ${className}`}
    >
      {/* 群聊详情 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold mr-4">
              {currentGroup.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentGroup.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {currentGroup.members.length}人 · 创建于{" "}
                {currentGroup.createdAt}
              </p>
            </div>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* 快捷操作按钮 */}
        <div className="flex space-x-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg flex items-center justify-center"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            发消息
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg flex items-center justify-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            语音通话
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg flex items-center justify-center"
          >
            <Video className="w-5 h-5 mr-2" />
            视频会议
          </motion.button>
        </div>
      </div>

      {/* 群聊信息 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* 群聊描述 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              群聊介绍
            </h3>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              {currentGroup.description}
            </p>
          </div>

          {/* 群成员 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                群成员 ({currentGroup.members.length})
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-blue-600 dark:text-blue-400 flex items-center text-sm"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                添加成员
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {member.name}
                      </h4>
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getRoleColor(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {member.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          退出群聊
        </motion.button>
      </div>
    </div>
  );
};

export default GroupDetail;
