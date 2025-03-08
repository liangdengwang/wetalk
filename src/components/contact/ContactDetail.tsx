import React from "react";
import { motion } from "motion/react";
import { useParams, useNavigate } from "react-router";
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

interface ContactDetailProps {
  className?: string;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ className = "" }) => {
  const { contactId } = useParams();
  const navigate = useNavigate();

  // 模拟联系人数据
  const contacts = [
    {
      id: 1,
      name: "张三",
      status: "在线",
      avatar: "张",
      email: "zhangsan@example.com",
      phone: "13800138000",
      address: "北京市海淀区中关村大街1号",
      company: "科技有限公司",
      position: "前端开发工程师",
      birthday: "1990-01-01",
      notes: "张三是一位经验丰富的前端开发工程师，擅长React和Vue框架。",
      isFavorite: true,
    },
    {
      id: 2,
      name: "李四",
      status: "离线",
      avatar: "李",
      email: "lisi@example.com",
      phone: "13900139000",
      address: "上海市浦东新区张江高科技园区",
      company: "互联网科技有限公司",
      position: "产品经理",
      birthday: "1988-05-15",
      notes: "李四是一位有创意的产品经理，负责公司核心产品的规划和设计。",
      isFavorite: false,
    },
    // 其他联系人...
  ];

  // 查找当前联系人
  const currentContact = contacts.find(
    (contact) => contact.id.toString() === contactId
  );

  // 如果没有找到联系人，显示空状态
  if (!currentContact) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">请选择一个联系人</p>
          <p className="text-sm">从左侧列表中选择一个联系人查看详情</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* 联系人详情头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-2xl mr-4 ${
                currentContact.status === "在线"
                  ? "bg-green-500"
                  : currentContact.status === "忙碌"
                  ? "bg-orange-500"
                  : "bg-gray-400"
              }`}
            >
              {currentContact.avatar}
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold">{currentContact.name}</h2>
                {currentContact.isFavorite && (
                  <Star className="w-5 h-5 text-yellow-500 ml-2 fill-current" />
                )}
              </div>
              <p className="text-gray-600">
                {currentContact.position} @ {currentContact.company}
              </p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${
                  currentContact.status === "在线"
                    ? "bg-green-100 text-green-800"
                    : currentContact.status === "忙碌"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
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
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Edit className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* 快捷操作按钮 */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center"
            onClick={() => navigate(`/chat/${contactId}`)}
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
            <span>通话</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg flex items-center justify-center"
          >
            <Video className="w-5 h-5 mr-2" />
            <span>视频</span>
          </motion.button>
        </div>
      </div>

      {/* 联系人详细信息 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">联系方式</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">手机</p>
                  <p className="text-gray-900">{currentContact.phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">邮箱</p>
                  <p className="text-gray-900">{currentContact.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 个人信息 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">个人信息</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">地址</p>
                  <p className="text-gray-900">{currentContact.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">公司</p>
                  <p className="text-gray-900">{currentContact.company}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">生日</p>
                  <p className="text-gray-900">{currentContact.birthday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 备注 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">备注</h3>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {currentContact.notes}
            </p>
          </div>
        </div>
      </div>

      {/* 底部操作区 */}
      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          <span>删除联系人</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ContactDetail;
