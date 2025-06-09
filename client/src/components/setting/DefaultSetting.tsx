import React from "react";
import { AlertCircle } from "lucide-react";
import BaseSettingLayout from "./common/BaseSettingLayout";

interface DefaultSettingProps {
  className?: string;
  title: string;
}

const DefaultSetting: React.FC<DefaultSettingProps> = ({
  className = "",
  title,
}) => {
  return (
    <BaseSettingLayout className={className} title={title}>
      <div className="space-y-6">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>此设置页面正在开发中，敬请期待...</p>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {title}功能介绍
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {title === "通知设置" &&
              "通知设置允许您控制接收哪些类型的通知，以及如何接收这些通知。您可以自定义消息提醒、系统通知和活动更新等。"}
            {title === "隐私与安全" &&
              "隐私与安全设置让您可以管理谁能看到您的信息，以及如何保护您的账户安全。您可以设置隐私选项、管理屏蔽列表等。"}
            {title === "外观" &&
              "外观设置允许您自定义应用的视觉风格。您可以选择深色或浅色主题，调整字体大小，以及其他界面选项。"}
            {title === "语言" &&
              "语言设置允许您更改应用的显示语言。我们支持多种语言，您可以选择最适合您的语言。"}
            {![
              "通知设置",
              "隐私与安全",
              "外观",
              "语言",
            ].includes(title) &&
              "此功能将帮助您更好地使用我们的应用。我们正在努力开发中，敬请期待更多精彩功能。"}
          </p>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </BaseSettingLayout>
  );
};

export default DefaultSetting;
