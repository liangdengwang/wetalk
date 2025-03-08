import React from "react";
import { Message } from "../../../store/chatStore";

interface MessageItemProps {
  message: Message;
  isGroup: boolean;
  onContextMenu: (e: React.MouseEvent, message: Message) => void;
  showHeader?: boolean; // 是否显示消息头部（用于分组显示）
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isGroup,
  onContextMenu,
  showHeader = true,
}) => {
  const isSelf = message.sender === "me";

  // 如果消息被删除，显示特殊样式
  if (message.deleted) {
    return (
      <div className="py-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
        <div className="flex items-start">
          {!isSelf && (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-white text-sm font-semibold mr-3 opacity-50 flex-shrink-0">
              {message.senderAvatar || (isGroup ? "G" : "U")}
            </div>
          )}
          <div className="flex-1">
            <p className="text-gray-400 dark:text-gray-500 text-sm italic w-full text-center">
              {isSelf ? "你" : message.senderName || "用户"} 撤回了一条消息
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-1 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
      onContextMenu={(e) => onContextMenu(e, message)}
    >
      <div className={`flex items-start group ${isSelf ? "justify-end" : ""}`}>
        {!isSelf && (
          <div className="w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-sm font-semibold mr-3 flex-shrink-0">
            {message.senderAvatar || (isGroup ? "G" : "U")}
          </div>
        )}

        <div
          className={`flex flex-col ${
            isSelf ? "items-end" : "items-start"
          } max-w-[75%]`}
        >
          {showHeader && !isSelf && isGroup && (
            <div className="flex items-center mb-1">
              <span className="font-medium text-gray-900 dark:text-white mr-2">
                {message.senderName || "用户"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {message.time}
              </span>
            </div>
          )}

          <div
            className={`flex items-end ${
              isSelf ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg break-words ${
                isSelf
                  ? "bg-[#5865F2] text-white rounded-tr-none"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none"
              }`}
            >
              {message.content}
            </div>

            <span
              className={`text-xs text-gray-500 dark:text-gray-400 ${
                isSelf ? "mr-2" : "ml-2"
              } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            >
              {message.time}
            </span>
          </div>
        </div>

        {isSelf && (
          <div className="w-10 h-10 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white text-sm font-semibold ml-3 flex-shrink-0">
            我
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
