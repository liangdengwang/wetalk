import React from "react";

interface AvatarProps {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
  isGroup?: boolean;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  text,
  size = "md",
  status,
  isGroup = false,
  className = "",
}) => {
  // 根据尺寸设置样式
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-2xl",
  };

  // 根据状态设置背景色
  const getBgColor = () => {
    if (isGroup) return "bg-blue-500";

    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-orange-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold ${
        sizeClasses[size]
      } ${getBgColor()} ${className}`}
    >
      {text}
    </div>
  );
};

export default Avatar;
