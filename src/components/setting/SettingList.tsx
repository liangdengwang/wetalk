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
      description: "获取帮助和支持",
    },
    {
      id: "about",
      icon: Info,
      label: "关于",
      description: "查看应用信息和版本",
    },
  ];

  // 处理设置项点击
  const handleSettingItemClick = (id: string) => {
    navigate(`/setting/${id}`);
  };

  // 判断设置项是否处于激活状态
  const isSettingActive = (id: string) => {
    return settingId === id;
  };

  return (
    <div
      className={`h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          设置
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {settingItems.map((item) => (
          <motion.div
            key={item.id}
            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
              isSettingActive(item.id) ? "bg-blue-50 dark:bg-blue-900/30" : ""
            }`}
            onClick={() => handleSettingItemClick(item.id)}
            style={
              {
                "--hover-color": document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#374151"
                  : "#f9fafb",
                "--tap-color": document.documentElement.classList.contains(
                  "dark"
                )
                  ? "#1f2937"
                  : "#f3f4f6",
              } as React.CSSProperties
            }
          >
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isSettingActive(item.id)
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SettingList;
