import { useEffect } from "react";
import ChatWindow from "../components/Chat/ChatWindow";
import ChatList from "../components/Chat/ChatList";
import socket from "../utils/socket";

const mockChats = [
  {
    id: "1",
    name: "张三",
    type: "private" as const,
    lastMessage: "你好啊！",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "技术交流群",
    type: "group" as const,
    lastMessage: "有人在线吗？",
    unreadCount: 5,
  },
];

const Chat = () => {
  useEffect(() => {
    // 假设token已经存储在localStorage中
    const token = localStorage.getItem("token");
    if (token) {
      socket.connect(token);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r">
        <ChatList chats={mockChats} />
      </div>
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
