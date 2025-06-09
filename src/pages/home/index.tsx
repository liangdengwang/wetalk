import React, { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import ChatListWithAPI from "../../components/chat/ChatListWithAPI";
import ChatArea from "../../components/chat/ChatArea";
import { useUserStore } from "../../store";
import useChatStore from "../../store/chatStore";
import socketManager from "../../utils/socket";
import { Socket } from "socket.io-client";
import { ChatMessage, Message } from "../../types/message";

const Home: React.FC = () => {
  const userStore = useUserStore();
  const token = userStore.userInfo?.token;
  const userId = userStore.userInfo?.userId;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 获取聊天store的方法
  const addMessage = useChatStore((state) => state.addMessage);
  const addOrUpdateChatItem = useChatStore(
    (state) => state.addOrUpdateChatItem
  );

  // 处理接收到的消息
  const handleReceivedMessage = (message: ChatMessage) => {
    console.log("收到消息:", message);
    if (message) {
      const { content, sender, groupId, time, senderName, senderAvatar } =
        message;

      // 确定聊天ID（私聊是发送者ID，群聊是群组ID）
      const chatId = groupId || sender;

      // 如果是自己发送的消息，不需要再次添加
      if (sender === userId) {
        console.log("自己发送的消息，跳过");
        return;
      }

      // 创建消息对象
      const newMessage: Message = {
        id: Date.now(), // 使用时间戳作为临时ID
        sender: "other",
        senderId: sender,
        content: content,
        time:
          time ||
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        timestamp: Date.now(),
      };

      // 添加消息到store
      addMessage(chatId, newMessage);

      // 更新聊天列表
      addOrUpdateChatItem({
        id: chatId,
        name: senderName || "用户",
        avatar: senderAvatar || "U",
        isGroup: !!groupId,
      });
    }
  };

  useEffect(() => {
    if (!token) {
      console.log("未找到token，无法建立连接");
      return;
    }

    // 使用socketManager连接
    socketManager.connect(token);
    const newSocket = socketManager.getSocket();

    // 监听连接状态变化
    const handleConnectionEvent = (data: { status: string }) => {
      setIsConnected(data.status === "connected");
      if (data.status === "connected") {
        setSocket(newSocket);
      } else {
        setSocket(null);
      }
    };

    // 注册事件监听器
    socketManager.on("connection_event", handleConnectionEvent);
    socketManager.on("message", handleReceivedMessage);

    // 检查初始连接状态
    if (newSocket?.connected) {
      setIsConnected(true);
      setSocket(newSocket);
    }

    return () => {
      // 清理事件监听
      socketManager.off("connection_event", handleConnectionEvent);
      socketManager.off("message", handleReceivedMessage);
      socketManager.disconnect();
    };
  }, [token, userId, addMessage, addOrUpdateChatItem]);

  return (
    <>
      <Layout
        centerSlot={<ChatListWithAPI className="h-full" />}
        rightSlot={
          <ChatArea
            className="h-full"
            socket={socket}
            isConnected={isConnected}
          />
        }
      />
    </>
  );
};

export default Home;
