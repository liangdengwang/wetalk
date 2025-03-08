import React from "react";
import { motion } from "motion/react";
import { useParams } from "react-router";
import { useUserStore } from "../../store/index";
import { LogOut, Save } from "lucide-react";

interface SettingDetailProps {
  className?: string;
}

const SettingDetail: React.FC<SettingDetailProps> = ({ className = "" }) => {
  const { settingId } = useParams();
  const logout = useUserStore((state) => state.logout);

  // 如果没有选择设置项，显示默认内容
  if (!settingId) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">请选择一个设置项</p>
          <p className="text-sm">从左侧列表中选择一个设置项进行配置</p>
        </div>
      </div>
    );
  }

  // 根据不同的设置项显示不同的内容
  const renderSettingContent = () => {
    switch (settingId) {
      case "profile":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">个人资料</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入用户名"
                  defaultValue="张三"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  电子邮箱
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入电子邮箱"
                  defaultValue="zhangsan@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  个人简介
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="输入个人简介"
                  defaultValue="我是一名前端开发工程师，热爱技术和创新。"
                />
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">关于应用</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">应用名称: WeTalk</p>
              <p className="text-gray-700 mb-2">版本: 1.0.0</p>
              <p className="text-gray-700 mb-2">开发者: Claude Team</p>
              <p className="text-gray-700">© 2023 WeTalk. 保留所有权利。</p>
            </div>
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center"
                onClick={logout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                <span>退出登录</span>
              </motion.button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              {settingId.charAt(0).toUpperCase() + settingId.slice(1)} 设置
            </h3>
            <p className="text-gray-500">此设置页面正在开发中，敬请期待...</p>
          </div>
        );
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          {settingId === "profile"
            ? "个人资料"
            : settingId === "notifications"
            ? "通知设置"
            : settingId === "privacy"
            ? "隐私与安全"
            : settingId === "appearance"
            ? "外观"
            : settingId === "language"
            ? "语言"
            : settingId === "devices"
            ? "已登录设备"
            : settingId === "help"
            ? "帮助"
            : settingId === "about"
            ? "关于"
            : "设置"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">{renderSettingContent()}</div>

      {/* 底部操作区 - 只在某些设置页面显示 */}
      {settingId === "profile" && (
        <div className="p-4 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            <span>保存更改</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default SettingDetail;
