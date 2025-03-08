import React from "react";
import { motion } from "motion/react";

interface ListItemProps {
  avatar: string;
  avatarColor: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  rightBadge?: number;
  isActive?: boolean;
  onClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  avatar,
  avatarColor,
  title,
  subtitle,
  rightText,
  rightBadge,
  isActive = false,
  onClick,
}) => {
  return (
    <motion.div
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
        isActive ? "bg-blue-50" : ""
      }`}
      whileHover={{ backgroundColor: "#f9fafb" }}
      whileTap={{ backgroundColor: "#f3f4f6" }}
      onClick={onClick}
    >
      <div className="flex items-center">
        {/* 头像 */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${avatarColor}`}
        >
          {avatar}
        </div>

        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
            {rightText && (
              <span className="text-xs text-gray-500">{rightText}</span>
            )}
          </div>
          {subtitle && (
            <div className="flex justify-between items-center mt-1">
              <p className="text-sm text-gray-500 truncate">{subtitle}</p>
              {rightBadge && rightBadge > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {rightBadge}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ListItem;
