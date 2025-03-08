import React from "react";
import { motion } from "motion/react";
import { Save, User, Mail, FileText } from "lucide-react";
import BaseSettingLayout from "./BaseSettingLayout";

interface ProfileSettingProps {
  className?: string;
}

const ProfileSetting: React.FC<ProfileSettingProps> = ({ className = "" }) => {
  const saveButton = (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center"
    >
      <Save className="w-5 h-5 mr-2" />
      <span>保存更改</span>
    </motion.button>
  );

  return (
    <BaseSettingLayout
      className={className}
      title="个人资料"
      footer={saveButton}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <img
              src="https://via.placeholder.com/80"
              alt="用户头像"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">张三</h3>
            <p className="text-sm text-gray-500">更新你的个人照片</p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              更改头像
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入用户名"
                defaultValue="张三"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              电子邮箱
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="输入电子邮箱"
                defaultValue="zhangsan@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              个人简介
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="输入个人简介"
                defaultValue="我是一名前端开发工程师，热爱技术和创新。"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">账号安全</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">修改密码</h4>
                <p className="text-sm text-gray-500">上次更新于 3 个月前</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                修改
              </button>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">两步验证</h4>
                <p className="text-sm text-gray-500">提高账号安全性</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800">
                启用
              </button>
            </div>
          </div>
        </div>
      </div>
    </BaseSettingLayout>
  );
};

export default ProfileSetting;
