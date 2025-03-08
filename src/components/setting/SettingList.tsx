import React from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router";
import {
  User,
  Bell,
  Shield,
  Globe,
  HelpCircle,
  Info,
  Moon,
  Smartphone,
} from "lucide-react";

interface SettingListProps {
  className?: string;
}

const SettingList: React.FC<SettingListProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const { settingId } = useParams();

  // 设置项列表
  const settingItems = [
    {
      id: "profile",
      icon: User,
      label: "个人资料",
      description: "修改你的个人信息和头像",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "通知设置",
      description: "管理消息和通知提醒",
    },
    {
      id: "privacy",
      icon: Shield,
      label: "隐私与安全",
      description: "控制谁可以联系你和查看你的信息",
    },
    {
      id: "appearance",
      icon: Moon,
      label: "外观",
      description: "自定义应用的主题和界面",
    },
    {
      id: "language",
      icon: Globe,
      label: "语言",
      description: "更改应用的显示语言",
    },
    {
      id: "devices",
      icon: Smartphone,
      label: "已登录设备",
      description: "查看和管理已登录的设备",
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "帮助",
      description: "获取使用帮助和支持",
    },
    {
      id: "about",
      icon: Info,
      label: "关于",
      description: "查看应用版本和相关信息",
    },
  ];

  return (
    <div
      className={`h-full flex flex-col border-r border-gray-200 ${className}`}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">设置</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {settingItems.map((item) => {
          const Icon = item.icon;
          const isActive = settingId === item.id;

          return (
            <motion.div
              key={item.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                isActive ? "bg-blue-50" : ""
              }`}
              whileHover={{ backgroundColor: "#f9fafb" }}
              whileTap={{ backgroundColor: "#f3f4f6" }}
              onClick={() => navigate(`/setting/${item.id}`)}
            >
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingList;
