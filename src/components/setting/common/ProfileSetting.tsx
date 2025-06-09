import React, { useState } from "react";
import { motion } from "motion/react";
import { Save, User, Mail, FileText, Hash, Loader2 } from "lucide-react";
import BaseSettingLayout from "./BaseSettingLayout";
import { useUser } from "../../../hooks/useUser";
import { EditUserDTO } from "../../../utils/user";

interface ProfileSettingProps {
  className?: string;
}

const ProfileSetting: React.FC<ProfileSettingProps> = ({ className = "" }) => {
  const { user, loading, error, updateUser } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<EditUserDTO>({});

  // 当用户数据加载完成时，更新表单数据
  React.useEffect(() => {
    if (user) {
      console.log("user:", user);
      
      setFormData({
        user_name: user.user_name,
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateUser(formData);
      // 可以在这里添加成功提示
    } catch (err) {
      console.error('保存失败:', err);
      // 可以在这里添加错误提示
    } finally {
      setIsUpdating(false);
    }
  };

  const saveButton = (
    <motion.button
      whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
      whileTap={{ scale: 0.98 }}
      className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleSave}
      disabled={isUpdating || loading}
    >
      {isUpdating ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>保存中...</span>
        </>
      ) : (
        <>
          <Save className="w-5 h-5 mr-2" />
          <span>保存更改</span>
        </>
      )}
    </motion.button>
  );

  // 显示加载状态
  if (loading) {
    return (
      <BaseSettingLayout
        className={className}
        title="个人资料"
        footer={<div></div>}
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </BaseSettingLayout>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <BaseSettingLayout
        className={className}
        title="个人资料"
        footer={<div></div>}
      >
        <div className="flex items-center justify-center h-40">
          <div className="text-red-500 text-center">
            <p className="text-lg font-bold mb-2">加载失败</p>
            <p>{error}</p>
          </div>
        </div>
      </BaseSettingLayout>
    );
  }

  return (
    <BaseSettingLayout
      className={className}
      title="个人资料"
      footer={saveButton}
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="用户头像"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {user?.user_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {user?.user_name || '未知用户'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              更新你的个人照片
            </p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
              更改头像
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* 个人ID（只读） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              个人ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                value={user?._id || ''}
                readOnly
                placeholder="个人ID"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              个人ID可用于添加好友时搜索
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              用户名
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                placeholder="输入用户名"
                value={formData.user_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              电子邮箱
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="email"
                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                placeholder="输入电子邮箱"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              个人简介
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <textarea
                className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                rows={4}
                placeholder="输入个人简介"
                value={formData.bio || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseSettingLayout>
  );
};

export default ProfileSetting;
