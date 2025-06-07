import React, { useMemo, useRef, useEffect } from "react";
import { Message } from "../../../store/chatStore";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: Message[];
  isGroup: boolean;
  onMessageContextMenu: (e: React.MouseEvent, message: Message) => void;
  className?: string;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isGroup,
  onMessageContextMenu,
  className = "",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 当消息列表更新时，自动滚动到底部
  useEffect(() => {
    // 使用setTimeout确保DOM更新完成后再滚动
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  // 对消息进行分组，相同发送者的连续消息分为一组
  const groupedMessages = useMemo(() => {
    return messages.map((message, index) => {
      // 检查当前消息是否与前一条消息是同一个发送者
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const isSameSender = prevMessage && prevMessage.sender === message.sender;

      // 如果是同一个发送者且时间间隔不大，则不显示头部
      // 如果消息被删除，始终显示头部
      const showHeader = !isSameSender || message.deleted;

      return { message, showHeader };
    });
  }, [messages]);

  // 如果没有消息，显示空状态
  if (messages.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-center mb-2">还没有消息</p>
        <p className="text-center text-sm">发送第一条消息开始聊天吧！</p>
        
        {/* 滚动到底部的锚点 */}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className={`flex-1 overflow-hidden bg-gray-50 dark:bg-gray-800 ${className}`}>
      <div className="h-full overflow-y-auto px-0 py-4">
        {/* 日期分隔线 */}
        <div className="flex items-center px-4 mb-4">
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
          <div className="px-2 text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString()}
          </div>
          <div className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* 消息列表 */}
        <div className="space-y-0">
          {groupedMessages.map(({ message, showHeader }) => (
            <MessageItem
              key={message.id}
              message={message}
              isGroup={isGroup}
              onContextMenu={onMessageContextMenu}
              showHeader={showHeader}
            />
          ))}
        </div>

        {/* 底部留白，方便滚动到最新消息 */}
        <div className="h-6"></div>
        
        {/* 滚动到底部的锚点 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
