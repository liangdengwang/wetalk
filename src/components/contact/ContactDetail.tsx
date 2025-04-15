import React from "react";
import { motion } from "motion/react";
import { useParams } from "react-router";
import {
  MessageSquare,
  Phone,
  Video,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Edit,
  Star,
  Trash2,
} from "lucide-react";
import { Contact } from "../../utils/contact";

interface ContactDetailProps {
  className?: string;
  contacts?: Contact[]; // 从API获取的联系人列表
  loading?: boolean; // 加载状态
  error?: string | null; // 错误信息
}

const ContactDetail: React.FC<ContactDetailProps> = ({
  className = "",
  contacts = [],
  loading = false,
  error = null,
}) => {
  const { contactId } = useParams();

  // 根据ID查找当前联系人
  const currentContact = contacts.find((contact) => contact.id === contactId);

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

  // 如果没有找到联系人，显示空状态
  if (!currentContact) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 ${className}`}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-xl mb-2">请选择一个联系人</p>
          <p className="text-sm">从左侧列表中选择一个联系人查看详情</p>
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

  return (
    <div
      className={`h-full flex flex-col bg-white dark:bg-gray-800 ${className}`}
    >
      {/* 联系人详情 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold mr-4 ${getStatusColor(
                currentContact.status
              )}`}
            >
              {currentContact.avatar}
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mr-2">
                  {currentContact.name}
                </h2>
                {currentContact.isFavorite && (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {currentContact.position
                  ? `${currentContact.position} @ ${currentContact.company}`
                  : ""}
              </p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                  currentContact.status === "在线"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : currentContact.status === "忙碌"
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                }`}
              >
                {currentContact.status}
              </span>
            </div>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Edit className="w-5 h-5" />
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
            通话
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg flex items-center justify-center"
          >
            <Video className="w-5 h-5 mr-2" />
            视频
          </motion.button>
        </div>
      </div>

      {/* 联系人信息 - 仅当有额外信息时显示 */}
      {(currentContact.phone ||
        currentContact.email ||
        currentContact.address ||
        currentContact.company ||
        currentContact.position ||
        currentContact.birthday ||
        currentContact.notes) && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* 联系方式 */}
            {(currentContact.phone ||
              currentContact.email ||
              currentContact.address) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  联系方式
                </h3>
                <div className="space-y-3">
                  {currentContact.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          手机
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {currentContact.phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {currentContact.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          邮箱
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {currentContact.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {currentContact.address && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          地址
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {currentContact.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 工作信息 */}
            {(currentContact.company || currentContact.position) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  工作信息
                </h3>
                <div className="space-y-3">
                  {currentContact.company && (
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          公司
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {currentContact.company}
                        </p>
                      </div>
                    </div>
                  )}
                  {currentContact.position && (
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          职位
                        </p>
                        <p className="text-gray-900 dark:text-white">
                          {currentContact.position}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 个人信息 */}
            {currentContact.birthday && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  个人信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        生日
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {currentContact.birthday}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 备注 */}
            {currentContact.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  备注
                </h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {currentContact.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          删除联系人
        </motion.button>
      </div>
    </div>
  );
};

export default ContactDetail;
