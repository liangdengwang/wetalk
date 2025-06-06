import React, { useEffect, useState } from "react";
import Layout from "../../components/common/Layout";
import ChatList from "../../components/chat/ChatList";
import ChatArea from "../../components/chat/ChatArea";
import { io, Socket } from "socket.io-client";
import { useUserStore } from "../../store";
import useChatStore, { Message } from "../../store/chatStore";
import { API_CONFIG } from "../../utils/config";

const Home: React.FC = () => {
  const userStore = useUserStore();
  const token = userStore.userInfo?.token;
  const userId = userStore.userInfo?.userId;
  const [socket, setSocket] = useState<Socket | null>(null);

  // 获取聊天store的方法
  const addMessage = useChatStore((state) => state.addMessage);
  const addOrUpdateChatItem = useChatStore(
    (state) => state.addOrUpdateChatItem
  );

  useEffect(() => {
    if (!token) return;

    // 创建socket连接，与后端网关对齐
    const newSocket = io(API_CONFIG.WS_URL, {
      query: {
        token: token,
      },
    });

    // 添加连接事件监听
    newSocket.on("connect", () => {
      console.log("Socket连接成功");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket连接错误:", error);
    });

    // 监听接收消息事件
    newSocket.on("receive_message", (message) => {
      console.log("收到消息:", message);

      // 处理接收到的消息
      if (message) {
        const { content, sender, receiver, groupId, time } = message;

        // 确定聊天ID（私聊是发送者ID，群聊是群组ID）
        const chatId = groupId || sender;

        // 如果是自己发送的消息，不需要再次添加
        if (sender === userId) return;

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

        // 如果是新的聊天，添加到聊天列表
        addOrUpdateChatItem({
          id: chatId,
          name: message.senderName || "用户",
          avatar: message.senderAvatar || "U",
          isGroup: !!groupId,
        });
      }
    });

    // 监听用户状态变化
    newSocket.on("user_status", (statusData) => {
      console.log("用户状态变化:", statusData);
      // 这里可以更新用户状态
    });

    // 监听好友请求
    newSocket.on("friend_request", (request) => {
      console.log("收到好友请求:", request);
      // 这里可以更新好友请求列表
    });

    setSocket(newSocket);

    // 组件卸载时断开连接
    return () => {
      newSocket.disconnect();
    };
  }, [token, userId, addMessage, addOrUpdateChatItem]); // 添加依赖项

  return (
    <Layout
      centerSlot={<ChatList className="h-full" socket={socket} />}
      rightSlot={<ChatArea className="h-full" socket={socket} />}
    />
  );
};

export default Home;
