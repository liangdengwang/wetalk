import React, { ReactNode } from "react";
import { motion } from "motion/react";

interface ActionButtonProps {
  icon: ReactNode;
  label?: string;
  color?: "primary" | "success" | "danger" | "warning" | "purple";
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  color = "primary",
  onClick,
  className = "",
  fullWidth = false,
}) => {
  // 根据颜色设置样式
  const colorClasses = {
    primary:
      "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600",
    success:
      "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600",
    danger: "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500",
    warning:
      "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-500",
    purple:
      "bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600",
  };

  // 根据是否有标签设置样式
  const sizeClasses = label ? "py-2 px-4 rounded-lg" : "p-2 rounded-full";

  // 根据是否全宽设置样式
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileHover={{ scale: label ? 1.02 : 1.1 }}
      whileTap={{ scale: label ? 0.98 : 0.9 }}
      className={`${colorClasses[color]} text-white flex items-center justify-center ${sizeClasses} ${widthClasses} ${className} transition-colors duration-200`}
      onClick={onClick}
    >
      {icon}
      {label && <span className={icon ? "ml-2" : ""}>{label}</span>}
    </motion.button>
  );
};

export default ActionButton;
