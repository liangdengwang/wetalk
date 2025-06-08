import React from "react";
import Layout from "../../components/common/Layout";
import ChatListWithAPI from "../../components/chat/ChatListWithAPI";
import ChatArea from "../../components/chat/ChatArea";
import { useWebSocketChat } from "../../hooks/useWebSocketChat";

const Home: React.FC = () => {
  // 使用新的WebSocket聊天系统
  const {
    isConnected,
    isConnecting,
    connectionError,
    sendMessage,
    clearError,
  } = useWebSocketChat({
    autoConnect: true,
    onConnectionError: (error) => {
      console.error('WebSocket连接错误:', error);
    },
  });

  return (
    <div className="h-screen flex flex-col">
      {/* 连接状态指示器 */}
      {connectionError && (
        <div className="px-4 py-2 bg-red-100 text-red-700 border-red-200 border-b text-sm flex items-center justify-between">
          <span>连接错误: {connectionError}</span>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            ✕
          </button>
        </div>
      )}
      
      {isConnecting && (
        <div className="px-4 py-2 bg-blue-100 text-blue-700 border-blue-200 border-b text-sm flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
          正在连接聊天服务...
        </div>
      )}

      <div className="flex-1">
        <Layout
          centerSlot={
            <ChatListWithAPI 
              className="h-full"
            />
          }
          rightSlot={
            <ChatArea 
              className="h-full" 
              sendMessage={sendMessage}
              isConnected={isConnected}
            />
          }
        />
      </div>
    </div>
  );
};

export default Home;
