import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

interface ChatAreaProps {
  className?: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ className = "" }) => {
  const [message, setMessage] = useState("");

  // 模拟聊天消息数据
  const messages = [
    { id: 1, sender: "other", content: "你好，最近在忙什么？", time: "10:30" },
    {
      id: 2,
      sender: "me",
      content: "在开发一个新的聊天应用，你呢？",
      time: "10:31",
    },
    {
      id: 3,
      sender: "other",
      content: "我在准备下周的演讲，有点紧张。",
      time: "10:32",
    },
    {
      id: 4,
      sender: "me",
      content: "别担心，你会做得很好的！需要我帮忙吗？",
      time: "10:33",
    },
    {
      id: 5,
      sender: "other",
      content: "谢谢你的鼓励！如果你有空的话，可以帮我看看演讲稿吗？",
      time: "10:35",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // 在这里处理发送消息的逻辑
      console.log("发送消息:", message);
      setMessage("");
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* 聊天头部 */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold mr-3">
            张
          </div>
          <div>
            <h2 className="font-medium">张三</h2>
            <p className="text-xs text-gray-500">在线</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Phone className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Video className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>
      </div>

      {/* 聊天内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-xs rounded-lg p-3 ${
                msg.sender === "me"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <p>{msg.content}</p>
              <p
                className={`text-xs mt-1 text-right ${
                  msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {msg.time}
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500"
          >
            <Paperclip className="w-5 h-5" />
          </motion.button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 py-2 px-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
          />
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500"
          >
            <Smile className="w-5 h-5" />
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.9 }}
            className="bg-blue-600 text-white p-2 rounded-full"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
