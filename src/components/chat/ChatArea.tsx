import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams } from "react-router";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Users,
  Info,
} from "lucide-react";

interface ChatAreaProps {
  className?: string;
}

// 定义消息接口
interface Message {
  id: number;
  sender: "me" | "other";
  senderId?: number;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  time: string;
}

// 定义联系人接口
interface Contact {
  id: number;
  name: string;
  status: string;
  avatar: string;
}

// 定义群聊接口
interface Group {
  id: number;
  name: string;
  avatar: string;
  memberCount: number;
}

const ChatArea: React.FC<ChatAreaProps> = ({ className = "" }) => {
  const [message, setMessage] = useState("");
  const { contactId, groupId } = useParams();
  const [currentChat, setCurrentChat] = useState<Contact | Group | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // 模拟联系人数据
  const contacts: Contact[] = [
    { id: 1, name: "张三", status: "在线", avatar: "张" },
    { id: 2, name: "李四", status: "离线", avatar: "李" },
    { id: 3, name: "王五", status: "忙碌", avatar: "王" },
    { id: 4, name: "赵六", status: "在线", avatar: "赵" },
  ];

  // 模拟群聊数据
  const groups: Group[] = [
    { id: 101, name: "技术交流群", avatar: "技", memberCount: 25 },
    { id: 102, name: "产品讨论组", avatar: "产", memberCount: 12 },
    { id: 103, name: "市场营销部", avatar: "市", memberCount: 18 },
  ];

  // 模拟个人聊天消息数据
  const personalChatMessages: Record<number, Message[]> = {
    1: [
      {
        id: 1,
        sender: "other",
        content: "你好，最近在忙什么？",
        time: "10:30",
      },
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
    ],
    2: [
      { id: 1, sender: "other", content: "项目进展如何？", time: "昨天 15:20" },
      {
        id: 2,
        sender: "me",
        content: "进展顺利，已经完成了大部分功能开发。",
        time: "昨天 15:25",
      },
      {
        id: 3,
        sender: "other",
        content: "太好了，客户应该会很满意。",
        time: "昨天 15:30",
      },
    ],
    3: [
      {
        id: 1,
        sender: "me",
        content: "周末有空一起吃饭吗？",
        time: "周三 18:10",
      },
      {
        id: 2,
        sender: "other",
        content: "可以啊，你想吃什么？",
        time: "周三 18:15",
      },
      {
        id: 3,
        sender: "me",
        content: "最近新开了一家火锅店，听说很不错。",
        time: "周三 18:20",
      },
      {
        id: 4,
        sender: "other",
        content: "好主意！周六晚上怎么样？",
        time: "周三 18:25",
      },
    ],
    4: [
      {
        id: 1,
        sender: "other",
        content: "明天的会议准备好了吗？",
        time: "09:15",
      },
      {
        id: 2,
        sender: "me",
        content: "已经准备好了，PPT刚刚发给你了。",
        time: "09:20",
      },
      {
        id: 3,
        sender: "other",
        content: "收到，我待会儿看看。",
        time: "09:22",
      },
    ],
  };

  // 模拟群聊消息数据
  const groupChatMessages: Record<number, Message[]> = {
    101: [
      {
        id: 1,
        sender: "other",
        senderId: 1,
        senderName: "张三",
        senderAvatar: "张",
        content: "大家好，有人遇到过React Router v6的问题吗？",
        time: "09:30",
      },
      {
        id: 2,
        sender: "other",
        senderId: 3,
        senderName: "王五",
        senderAvatar: "王",
        content: "什么问题？可以详细说说吗？",
        time: "09:32",
      },
      {
        id: 3,
        sender: "me",
        content: "我之前遇到过，可能是版本兼容问题。",
        time: "09:35",
      },
      {
        id: 4,
        sender: "other",
        senderId: 1,
        senderName: "张三",
        senderAvatar: "张",
        content: "我在使用嵌套路由时，子路由无法正确匹配。",
        time: "09:37",
      },
      {
        id: 5,
        sender: "other",
        senderId: 2,
        senderName: "李四",
        senderAvatar: "李",
        content: "你需要在父路由组件中添加<Outlet />组件。",
        time: "09:40",
      },
    ],
    102: [
      {
        id: 1,
        sender: "other",
        senderId: 3,
        senderName: "王五",
        senderAvatar: "王",
        content: "新产品的原型已经设计好了，大家可以看看。",
        time: "14:20",
      },
      {
        id: 2,
        sender: "me",
        content: "看起来不错，但是用户流程可能需要优化。",
        time: "14:25",
      },
      {
        id: 3,
        sender: "other",
        senderId: 6,
        senderName: "孙八",
        senderAvatar: "孙",
        content: "同意，注册流程太复杂了。",
        time: "14:30",
      },
    ],
    103: [
      {
        id: 1,
        sender: "other",
        senderId: 2,
        senderName: "李四",
        senderAvatar: "李",
        content: "下周的营销活动准备得怎么样了？",
        time: "11:10",
      },
      {
        id: 2,
        sender: "other",
        senderId: 4,
        senderName: "赵六",
        senderAvatar: "赵",
        content: "海报和宣传材料已经准备好了。",
        time: "11:15",
      },
      {
        id: 3,
        sender: "me",
        content: "社交媒体推广计划也已经制定好了。",
        time: "11:20",
      },
      {
        id: 4,
        sender: "other",
        senderId: 5,
        senderName: "钱七",
        senderAvatar: "钱",
        content: "预算控制在多少？",
        time: "11:25",
      },
      {
        id: 5,
        sender: "other",
        senderId: 2,
        senderName: "李四",
        senderAvatar: "李",
        content: "不超过5万元。",
        time: "11:30",
      },
    ],
  };

  // 根据路由参数加载对应的聊天数据
  useEffect(() => {
    if (contactId) {
      const id = parseInt(contactId);
      const contact = contacts.find((c) => c.id === id);
      if (contact) {
        setCurrentChat(contact);
        setIsGroup(false);
        setMessages(personalChatMessages[id] || []);
      }
    } else if (groupId) {
      const id = parseInt(groupId);
      const group = groups.find((g) => g.id === id);
      if (group) {
        setCurrentChat(group);
        setIsGroup(true);
        setMessages(groupChatMessages[id] || []);
      }
    } else {
      setCurrentChat(null);
      setMessages([]);
    }
  }, [contactId, groupId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "me",
        content: message.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  // 如果没有选择聊天对象，显示空状态
  if (!currentChat) {
    return (
      <div
        className={`h-full flex flex-col items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">开始聊天</p>
          <p className="text-sm">从左侧列表中选择一个联系人或群聊</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* 聊天头部 */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${
              isGroup
                ? "bg-blue-500"
                : "status" in currentChat && currentChat.status === "在线"
                ? "bg-green-500"
                : "status" in currentChat && currentChat.status === "忙碌"
                ? "bg-orange-500"
                : "bg-gray-400"
            }`}
          >
            {currentChat.avatar}
          </div>
          <div>
            <h2 className="font-medium">{currentChat.name}</h2>
            <p className="text-xs text-gray-500">
              {isGroup
                ? `${(currentChat as Group).memberCount}人`
                : (currentChat as Contact).status}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Phone className="w-5 h-5 text-gray-600" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Video className="w-5 h-5 text-gray-600" />
          </motion.button>
          {isGroup && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Users className="w-5 h-5 text-gray-600" />
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Info className="w-5 h-5 text-gray-600" />
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
            {msg.sender === "other" && isGroup && msg.senderId && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold mr-2 self-end">
                {msg.senderAvatar}
              </div>
            )}
            <div className="flex flex-col max-w-xs">
              {msg.sender === "other" && isGroup && msg.senderName && (
                <span className="text-xs text-gray-500 mb-1 ml-1">
                  {msg.senderName}
                </span>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-3 ${
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
