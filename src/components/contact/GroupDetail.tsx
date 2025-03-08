import React from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
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
  const navigate = useNavigate();

  // 模拟群聊数据
  const groups = [
    {
      id: 101,
      name: "技术交流群",
      avatar: "技",
      description: "讨论技术问题和分享技术文章的群组",
      createdAt: "2023-01-15",
      members: [
        { id: 1, name: "张三", role: "群主", avatar: "张", status: "在线" },
        { id: 2, name: "李四", role: "管理员", avatar: "李", status: "离线" },
        { id: 3, name: "王五", role: "成员", avatar: "王", status: "忙碌" },
        { id: 4, name: "赵六", role: "成员", avatar: "赵", status: "在线" },
        { id: 5, name: "钱七", role: "成员", avatar: "钱", status: "离线" },
        { id: 8, name: "吴十", role: "成员", avatar: "吴", status: "忙碌" },
      ],
      memberCount: 25,
    },
    {
      id: 102,
      name: "产品讨论组",
      avatar: "产",
      description: "讨论产品设计和用户体验的群组",
      createdAt: "2023-02-20",
      members: [
        { id: 1, name: "张三", role: "群主", avatar: "张", status: "在线" },
        { id: 3, name: "王五", role: "管理员", avatar: "王", status: "忙碌" },
        { id: 6, name: "孙八", role: "成员", avatar: "孙", status: "在线" },
        { id: 7, name: "周九", role: "成员", avatar: "周", status: "离线" },
      ],
      memberCount: 12,
    },
    {
      id: 103,
      name: "市场营销部",
      avatar: "市",
      description: "讨论市场策略和营销活动的部门群组",
      createdAt: "2023-03-10",
      members: [
        { id: 2, name: "李四", role: "群主", avatar: "李", status: "离线" },
        { id: 4, name: "赵六", role: "管理员", avatar: "赵", status: "在线" },
        { id: 5, name: "钱七", role: "成员", avatar: "钱", status: "离线" },
        { id: 9, name: "郑十一", role: "成员", avatar: "郑", status: "在线" },
        { id: 10, name: "冯十二", role: "成员", avatar: "冯", status: "离线" },
      ],
      memberCount: 18,
    },
  ];

  // 查找当前群聊
  const currentGroup = groups.find((group) => group.id.toString() === groupId);

  // 如果没有找到群聊，显示空状态
  if (!currentGroup) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">请选择一个群聊</p>
          <p className="text-sm">从左侧列表中选择一个群聊查看详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* 群聊详情头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl mr-4">
              {currentGroup.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentGroup.name}</h2>
              <p className="text-gray-600">
                {currentGroup.memberCount}人 · 创建于{currentGroup.createdAt}
              </p>
            </div>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* 快捷操作按钮 */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center"
            onClick={() => navigate(`/chat/group/${currentGroup.id}`)}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            <span>发消息</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg flex items-center justify-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            <span>语音通话</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg flex items-center justify-center"
          >
            <Video className="w-5 h-5 mr-2" />
            <span>视频会议</span>
          </motion.button>
        </div>
      </div>

      {/* 群聊详细信息 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* 群聊描述 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">群聊介绍</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {currentGroup.description}
            </p>
          </div>

          {/* 群成员 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">群成员</h3>
              <span className="text-sm text-gray-500">
                {currentGroup.members.length}/{currentGroup.memberCount}
              </span>
            </div>
            <div className="space-y-3">
              {currentGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${
                        member.status === "在线"
                          ? "bg-green-500"
                          : member.status === "忙碌"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full mr-2 ${
                            member.role === "群主"
                              ? "bg-red-100 text-red-800"
                              : member.role === "管理员"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.role}
                        </span>
                        <span
                          className={`text-xs ${
                            member.status === "在线"
                              ? "text-green-600"
                              : member.status === "忙碌"
                              ? "text-orange-600"
                              : "text-gray-500"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-600 text-sm"
                    onClick={() => navigate(`/contacts/${member.id}`)}
                  >
                    查看
                  </motion.button>
                </div>
              ))}

              {/* 查看更多成员按钮 */}
              {currentGroup.members.length < currentGroup.memberCount && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 text-blue-600 border border-blue-200 rounded-lg flex items-center justify-center mt-2"
                >
                  查看全部{currentGroup.memberCount}名成员
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作区 */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          <span>邀请成员</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          <span>退出群聊</span>
        </motion.button>
      </div>
    </div>
  );
};

export default GroupDetail;
