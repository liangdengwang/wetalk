import React, { useEffect, useState } from "react";
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
import {
  Group,
  GroupDetail as GroupDetailType,
  GroupDetailResponse,
  processGroupDetailResponse,
} from "../../utils/group";
import api from "../../utils/api";
import useChatStore from "../../store/chatStore";

interface GroupDetailProps {
  className?: string;
  groups?: Group[]; // 从API获取的群组列表
  loading?: boolean; // 加载状态
  error?: string | null; // 错误信息
}

const GroupDetail: React.FC<GroupDetailProps> = ({
  className = "",
  groups = [],
  loading: initialLoading = false,
  error: initialError = null,
}) => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const addOrUpdateChatItem = useChatStore(
    (state) => state.addOrUpdateChatItem
  );

  // 本地状态 - 用于获取单个群组的详细信息
  const [groupDetail, setGroupDetail] = useState<GroupDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(initialError);

  // 获取单个群组详情
  useEffect(() => {
    if (!groupId) return;

    const fetchGroupDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get<GroupDetailResponse>(
          `/groups/${groupId}`
        );

        // 处理返回的数据
        const detail = processGroupDetailResponse(response.data);
        if (detail) {
          setGroupDetail(detail);
          setError(null);
        } else {
          setError("获取群组详情失败");
        }
      } catch (err) {
        console.error("获取群组详情失败:", err);
        setError("获取群组详情失败");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [groupId]);

  // 处理点击发消息按钮
  const handleMessageClick = () => {
    if (groupId) {
      // 获取群组信息，优先使用groupDetail，如果没有则从groups中获取
      const group = groupDetail || groups.find((g) => g.id === groupId);

      if (group) {
        // 添加群组到聊天列表
        addOrUpdateChatItem({
          id: groupId,
          name: group.name,
          avatar: group.avatar || "群",
          isGroup: true,
          memberCount: (group as GroupDetailType).members?.length || 0,
        });
      } else {
        // 如果没有群组信息，使用默认值
        addOrUpdateChatItem({
          id: groupId,
          name: `群聊 ${groupId}`,
          avatar: "群",
          isGroup: true,
        });
      }

      // 导航到聊天页面
      navigate(`/chat/group/${groupId}`);
    }
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 ${className}`}
      >
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 ${className}`}
      >
        <div className="text-red-500 text-center">
          <p className="text-lg font-bold mb-2">出错了</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // 如果没有找到群聊，显示空状态
  if (!groupDetail) {
    // 先尝试从传入的群组列表中查找
    const groupFromList = groups.find((group) => group.id === groupId);

    if (!groupFromList) {
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
  }

  // 使用获取到的群组详情，如果没有则使用群组列表中的数据
  const currentGroup = groupDetail;

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

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return "未知日期";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
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
              {currentGroup?.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentGroup?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {currentGroup?.members?.length || 0}人 · 创建于{" "}
                {formatDate(currentGroup?.createdAt)}
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
            onClick={handleMessageClick}
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
          {currentGroup?.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                群聊介绍
              </h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {currentGroup.description}
              </p>
            </div>
          )}

          {/* 群主信息 */}
          {currentGroup?.owner && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                群主
              </h3>
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center text-white font-medium mr-3">
                  {currentGroup.owner.charAt(0)}
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {currentGroup.owner}
                  </span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    群主
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 群成员 */}
          {currentGroup?.members && currentGroup.members.length > 0 && (
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
              <div className="space-y-2">
                {currentGroup.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mr-3 ${
                          member.role === "群主"
                            ? "bg-red-500 dark:bg-red-600"
                            : "bg-gray-400 dark:bg-gray-500"
                        }`}
                      >
                        {member.avatar}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </span>
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getRoleColor(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
