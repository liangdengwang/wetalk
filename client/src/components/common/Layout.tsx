import React, { useState, ReactNode } from "react";
import { motion } from "motion/react";
import Sidebar from "../setting/Sidebar";

interface LayoutProps {
  centerSlot?: ReactNode; // 中间列表区域的插槽
  rightSlot?: ReactNode; // 右侧内容区域的插槽
}

const Layout: React.FC<LayoutProps> = ({ centerSlot, rightSlot }) => {
  const [centerWidth, setCenterWidth] = useState(280); // 默认宽度
  const [isDragging, setIsDragging] = useState(false);

  // 处理拖拽调整宽度
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging) {
      const newWidth = e.clientX;
      // 限制最小和最大宽度
      if (newWidth > 200 && newWidth < 400) {
        setCenterWidth(newWidth);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="w-screen h-screen flex bg-white dark:bg-gray-900"
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* 左边固定的导航栏区域 */}
      <Sidebar />

      {/* 中间可拖拽的列表区域 */}
      <div style={{ width: centerWidth }} className="h-full">
        {centerSlot}
      </div>

      {/* 拖拽调整器 */}
      <motion.div
        className="w-1 h-full bg-gray-200 dark:bg-gray-700 cursor-col-resize hover:bg-blue-500 dark:hover:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-700 transition-colors duration-200"
        onMouseDown={handleDragStart}
        whileHover={{ backgroundColor: "var(--hover-color, #3b82f6)" }}
        whileTap={{ backgroundColor: "var(--tap-color, #2563eb)" }}
        style={
          {
            "--hover-color": document.documentElement.classList.contains("dark")
              ? "#2563eb"
              : "#3b82f6",
            "--tap-color": document.documentElement.classList.contains("dark")
              ? "#1d4ed8"
              : "#2563eb",
          } as React.CSSProperties
        }
      />

      {/* 右边固定的内容区域 */}
      <div className="flex-1 h-full">{rightSlot}</div>
    </div>
  );
};

export default Layout;
