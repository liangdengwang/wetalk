import React, { useState } from "react";
import { motion } from "motion/react";
import Sidebar from "./Sidebar";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";

const Layout: React.FC = () => {
  const [chatListWidth, setChatListWidth] = useState(280);
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
        setChatListWidth(newWidth);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="w-screen h-screen flex"
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* 左边固定的导航栏区域 */}
      <Sidebar />

      {/* 中间可拖拽的聊天列表区域 */}
      <ChatList className="w-[280px]" style={{ width: chatListWidth }} />

      {/* 拖拽调整器 */}
      <motion.div
        className="w-1 h-full bg-gray-200 cursor-col-resize hover:bg-blue-500 active:bg-blue-600 transition-colors duration-200"
        onMouseDown={handleDragStart}
        whileHover={{ backgroundColor: "#3b82f6" }}
        whileTap={{ backgroundColor: "#2563eb" }}
      />

      {/* 右边固定的聊天区域 */}
      <ChatArea className="flex-1" />
    </div>
  );
};

export default Layout;
