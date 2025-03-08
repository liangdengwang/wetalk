import React from "react";
import { motion } from "motion/react";
import { LogOut, Github, Globe, Twitter } from "lucide-react";
import { useUserStore } from "../../../store/index";
import BaseSettingLayout from "./BaseSettingLayout";

interface AboutSettingProps {
  className?: string;
}

const AboutSetting: React.FC<AboutSettingProps> = ({ className = "" }) => {
  const logout = useUserStore((state) => state.logout);

  const logoutButton = (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "#ef4444" }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-2 px-4 bg-red-500 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
      onClick={logout}
    >
      <LogOut className="w-5 h-5 mr-2" />
      <span>退出登录</span>
    </motion.button>
  );

  return (
    <BaseSettingLayout className={className} title="关于" footer={logoutButton}>
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
            <img
              src="/logo.png"
              alt="WeTalk Logo"
              className="w-16 h-16"
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/64";
              }}
            />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
            WeTalk
          </h3>
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
            版本 1.0.0
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
            应用信息
          </h4>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300 flex justify-between transition-colors duration-200">
              <span>应用名称:</span>
              <span className="font-medium">WeTalk</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex justify-between transition-colors duration-200">
              <span>版本:</span>
              <span className="font-medium">1.0.0</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex justify-between transition-colors duration-200">
              <span>开发者:</span>
              <span className="font-medium">Claude Team</span>
            </p>
            <p className="text-gray-700 dark:text-gray-300 flex justify-between transition-colors duration-200">
              <span>发布日期:</span>
              <span className="font-medium">2023年12月1日</span>
            </p>
          </div>
        </div>

        <div className="pt-4">
          <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
            联系我们
          </h4>
          <div className="flex space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Twitter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
            <a
              href="https://wetalk.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <Globe className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 transition-colors duration-200">
          <p>© 2023 WeTalk. 保留所有权利。</p>
        </div>
      </div>
    </BaseSettingLayout>
  );
};

export default AboutSetting;
