import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import { Copy, Trash, RotateCcw } from "lucide-react";
import useChatStore, { Message } from "../../store/chatStore";
import ContextMenu, { ContextMenuItem } from "../common/ContextMenu";
import { Socket } from "socket.io-client";
import { useUserStore } from "../../store";

// 导入新创建的组件
import ChatHeader from "./common/ChatHeader";
import MessageList from "./common/MessageList";
import ChatInput from "./common/ChatInput";
import EmptyState from "./common/EmptyState";

interface ChatAreaProps {
  className?: string;
  socket: Socket | null;
}

// 定义联系人接口
interface Contact {
  id: string;
  name: string;
  status: string;
  avatar: string;
}

// 定义群聊接口
interface Group {
  id: string;
  name: string;
  avatar: string;
  memberCount: number;
}

const ChatArea: React.FC<ChatAreaProps> = ({ className = "", socket }) => {
  const { contactId, groupId } = useParams();
  const [currentChat, setCurrentChat] = useState<Contact | Group | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const userStore = useUserStore();
  const userId = userStore.userInfo?.userId;

  // 计算当前聊天ID
  const chatId = useMemo(() => {
    return isGroup ? groupId : contactId;
  }, [contactId, groupId, isGroup]);

  // 使用聊天状态管理
  const messages = useChatStore((state) => state.messages);
  const chatList = useChatStore((state) => state.chatList);
  const markAsRead = useChatStore((state) => state.markAsRead);
  const addMessage = useChatStore((state) => state.addMessage);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const recallMessage = useChatStore((state) => state.recallMessage);

  // 获取当前聊天的消息
  const chatMessages = useMemo(() => {
    return chatId ? messages[chatId] || [] : [];
  }, [messages, chatId]);

  // 当路由参数变化时，更新当前聊天对象
  useEffect(() => {
    if (contactId) {     
           
      // 从聊天列表中查找联系人
      const chatItem = chatList.find(
        (chat) => chat.id == contactId && !chat.isGroup
      );
 
      if (chatItem) {     
        setCurrentChat({
          id: chatItem.id,
          name: chatItem.name,
          status: "online", // 默认状态
          avatar: chatItem.avatar,
        });
        setIsGroup(false);
      }
      
    } else if (groupId) {   
      // 从聊天列表中查找群组
      const chatItem = chatList.find(
        (chat) => chat.id == groupId && chat.isGroup
      );
      if (chatItem) {
        setCurrentChat({
          id: chatItem.id,
          name: chatItem.name,
          avatar: chatItem.avatar,
          memberCount: 0, // 默认成员数
        });
        setIsGroup(true);
      }
    } else {
      setCurrentChat(null);
    }
  }, [contactId, groupId, chatList]);

  // 标记为已读的效果
  useEffect(() => {
    if (chatId) {
      markAsRead(chatId);
    }
  }, [chatId, markAsRead]);

  // 上下文菜单状态
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    position: { x: number; y: number };
    messageId: number;
    message: Message | null;
  }>({
    visible: false,
    position: { x: 0, y: 0 },
    messageId: 0,
    message: null,
  });

  // 处理消息右键点击
  const handleMessageContextMenu = useCallback(
    (e: React.MouseEvent, message: Message) => {
      e.preventDefault();
      setContextMenu({
        visible: true,
        position: { x: e.clientX, y: e.clientY },
        messageId: message.id,
        message,
      });
    },
    []
  );

  // 关闭上下文菜单
  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  }, []);

  // 复制消息内容
  const copyMessageContent = useCallback(() => {
    if (contextMenu.message) {
      navigator.clipboard.writeText(contextMenu.message.content);
    }
  }, [contextMenu.message]);

  // 删除消息
  const handleDeleteMessage = useCallback(() => {
    if (contextMenu.messageId && chatId) {
      deleteMessage(chatId, contextMenu.messageId);
    }
  }, [contextMenu.messageId, chatId, deleteMessage]);

  // 撤回消息
  const handleRecallMessage = useCallback(() => {
    if (contextMenu.messageId && chatId) {
      recallMessage(chatId, contextMenu.messageId);
    }
  }, [contextMenu.messageId, chatId, recallMessage]);

  // 检查消息是否可以撤回（2分钟内的自己发送的消息）
  const canRecallMessage = useCallback((message: Message) => {
    if (message.sender !== "me" || message.deleted) return false;

    const now = Date.now();
    const messageTime = message.timestamp || 0;
    const twoMinutesInMs = 2 * 60 * 1000;

    return now - messageTime <= twoMinutesInMs;
  }, []);

  // 上下文菜单项
  const contextMenuItems = useMemo(() => {
    const items: ContextMenuItem[] = [];

    if (contextMenu.message) {
      // 复制选项
      items.push({
        id: "copy",
        label: "复制",
        icon: <Copy className="w-4 h-4" />,
        onClick: copyMessageContent,
      });

      // 撤回选项（仅对自己发送的2分钟内的消息可用）
      if (canRecallMessage(contextMenu.message)) {
        items.push({
          id: "recall",
          label: "撤回",
          icon: <RotateCcw className="w-4 h-4" />,
          onClick: handleRecallMessage,
        });
      }

      // 删除选项
      items.push({
        id: "delete",
        label: "删除",
        icon: <Trash className="w-4 h-4" />,
        onClick: handleDeleteMessage,
        danger: true,
      });
    }

    return items;
  }, [
    contextMenu.message,
    copyMessageContent,
    canRecallMessage,
    handleRecallMessage,
    handleDeleteMessage,
  ]);

  // 处理发送消息
  const handleSendMessage = useCallback(
    (content: string) => {
      if (content && currentChat && chatId && socket) {
        const time = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        
        // 创建新消息对象
        const newMessage: Message = {
          id: chatMessages.length + 1,
          sender: "me",
          content: content,
          time: time,
          timestamp: Date.now(),
        };
  
        // 添加消息到状态管理
        addMessage(chatId, newMessage);
        
        // 通过socket发送消息 - 修改事件名称为 "message"
        if (isGroup) {
          // 发送群聊消息
          socket.emit("message", {
            content: content,
            sender: userId,
            groupId: chatId,
            time: time
          });
        } else {
          // 发送私聊消息
          socket.emit("message", {
            content: content,
            sender: userId,
            receiver: chatId,
            time: time
          });
        }
      }
    },
    [currentChat, chatId, chatMessages.length, addMessage, socket, isGroup, userId]
  );

  // 处理表情选择
  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      if (currentChat && chatId) {
        // 直接发送表情消息
        handleSendMessage(emoji);
      }
    },
    [currentChat, chatId, handleSendMessage]
  );

  // 如果没有选择聊天对象，显示空状态
  if (!currentChat) {
    return <EmptyState className={className} />;
  }

  return (
    <div
      className={`flex flex-col h-full bg-gray-700 dark:bg-gray-800 ${className}`}
    >
      {/* 聊天头部 */}
      <ChatHeader
        currentChat={currentChat}
        isGroup={isGroup}
        className="flex-shrink-0"
      />

      {/* 消息列表 */}
      <MessageList
        messages={chatMessages}
        isGroup={isGroup}
        onMessageContextMenu={handleMessageContextMenu}
        className="flex-1"
      />

      {/* 聊天输入区域 */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onEmojiSelect={handleEmojiSelect}
        className="flex-shrink-0"
      />

      {/* 上下文菜单 */}
      <ContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        items={contextMenuItems}
        onClose={closeContextMenu}
      />
    </div>
  );
};

export default ChatArea;
