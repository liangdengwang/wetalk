import React from "react";
import { useParams } from "react-router";
import { ProfileSetting, AboutSetting, DefaultSetting } from "./common";
import AppearanceSetting from "./AppearanceSetting";

interface SettingDetailProps {
  className?: string;
}

const SettingDetail: React.FC<SettingDetailProps> = ({ className = "" }) => {
  const { settingId } = useParams();

  // 如果没有选择设置项，显示默认内容
  if (!settingId) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
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
        return <ProfileSetting className="h-full" />;
      case "about":
        return <AboutSetting className="h-full" />;
      case "notifications":
        return <DefaultSetting className="h-full" title="通知设置" />;
      case "privacy":
        return <DefaultSetting className="h-full" title="隐私与安全" />;
      case "appearance":
        return <AppearanceSetting className="h-full" />;
      case "language":
        return <DefaultSetting className="h-full" title="语言" />;
      default:
        return <DefaultSetting className="h-full" title="设置" />;
    }
  };

  return renderSettingContent();
};

export default SettingDetail;
