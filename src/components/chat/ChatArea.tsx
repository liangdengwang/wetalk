import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "react-router";
import { Copy, Trash, RotateCcw } from "lucide-react";
import useChatStore, { Message } from "../../store/chatStore";
import ContextMenu, { ContextMenuItem } from "../common/ContextMenu";
import { useUserStore } from "../../store";
import { useMessages } from "../../hooks/useMessages";
import { MessageType, CreateMessageDto } from "../../utils/message";

// 导入新创建的组件
import ChatHeader from "./common/ChatHeader";
import MessageList from "./common/MessageList";
import ChatInput from "./common/ChatInput";
import EmptyState from "./common/EmptyState";

interface ChatAreaProps {
  className?: string;
  sendMessage?: (content: string, receiver?: string, groupId?: string) => boolean;
  isConnected?: boolean;
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

const ChatArea: React.FC<ChatAreaProps> = ({ 
  className = "", 
  sendMessage: webSocketSendMessage,
  isConnected = false 
}) => {
  const { contactId, groupId } = useParams();
  const [currentChat, setCurrentChat] = useState<Contact | Group | null>(null);
  const [isGroup, setIsGroup] = useState(false);
  const userStore = useUserStore();
  const userId = userStore.userInfo?.userId;

  // 计算当前聊天ID
  const chatId = useMemo(() => {
    return isGroup ? groupId : contactId;
  }, [contactId, groupId, isGroup]);

  // 使用聊天状态管理（本地数据优先）
  const messages = useChatStore((state) => state.messages);
  const chatList = useChatStore((state) => state.chatList);
  const markAsRead = useChatStore((state) => state.markAsRead);
  const addMessage = useChatStore((state) => state.addMessage);
  const deleteMessage = useChatStore((state) => state.deleteMessage);
  const recallMessage = useChatStore((state) => state.recallMessage);

  // 获取当前聊天的消息（本地优先）
  const chatMessages = useMemo(() => {
    return chatId ? messages[chatId] || [] : [];
  }, [messages, chatId]);

  // 使用API hooks进行后台同步
  const {
    loading,
    error,
    getPrivateMessages,
    getGroupMessages,
    createMessage,
    markConversationAsRead,
    clearError
  } = useMessages();

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

  // 加载消息：先显示本地消息，再同步远程消息
  useEffect(() => {
    if (!chatId || !userId) return;

    const loadAndMergeMessages = async () => {
      try {
        clearError();
        console.log(`开始同步远程消息 - 聊天ID: ${chatId}, 是否群组: ${isGroup}`);
        
        // 先显示本地消息，用户可以立即看到聊天历史
        console.log(`本地消息数量: ${chatMessages.length}`);
        
        // 然后异步加载远程消息进行合并
        let apiMsgs;
        if (isGroup) {
          apiMsgs = await getGroupMessages(chatId);
        } else {
          apiMsgs = await getPrivateMessages(chatId);
        }
        
        if (apiMsgs && apiMsgs.length > 0) {
          console.log(`远程消息数量: ${apiMsgs.length}`);
          // TODO: 这里可以实现消息合并逻辑，避免重复
          // 为了简化，目前只使用本地消息
        }
      } catch (err) {
        console.warn('同步远程消息失败，使用本地消息:', err);
        // 失败时仍然显示本地消息，确保用户体验
      }
    };

    loadAndMergeMessages();
  }, [chatId, userId, isGroup, getPrivateMessages, getGroupMessages, clearError]);

  // 标记为已读的效果
  useEffect(() => {
    if (chatId) {
      // 本地标记为已读
      markAsRead(chatId);
      
      // 异步同步到服务器（失败不影响本地状态）
      if (userId) {
        const syncReadStatus = async () => {
          try {
            if (isGroup) {
              await markConversationAsRead(undefined, chatId);
            } else {
              await markConversationAsRead(chatId, undefined);
            }
          } catch (err) {
            console.warn('同步已读状态失败:', err);
          }
        };
        syncReadStatus();
      }
    }
  }, [chatId, userId, isGroup, markAsRead, markConversationAsRead]);

  // 自动重发机制：监听网络状态变化，重发待发送的消息
  useEffect(() => {
    const retryPendingMessages = async () => {
      const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
      if (pendingMessages.length === 0) return;

      console.log(`尝试重发 ${pendingMessages.length} 条待发送消息`);
      
      for (const pending of pendingMessages) {
        try {
          await createMessage(pending.messageData);
          console.log('重发消息成功:', pending.messageData.content);
          
          // 从待发送列表移除
          const remaining = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
          const filtered = remaining.filter((msg: {localId: number}) => msg.localId !== pending.localId);
          localStorage.setItem('pendingMessages', JSON.stringify(filtered));
        } catch (err) {
          console.log('重发消息失败，保持在待发送列表:', pending.messageData.content, err);
        }
      }
    };

    const handleOnline = () => {
      console.log('网络已恢复，尝试重发待发送消息');
      retryPendingMessages();
    };

    // 页面加载时尝试重发
    retryPendingMessages();
    
    // 监听网络状态
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [createMessage]);

  // 处理发送消息（本地优先策略）
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content || !currentChat || !chatId || !userId) return;

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      // 1. 先创建本地消息，立即显示
      const newMessage: Message = {
        id: Date.now() + Math.floor(Math.random() * 1000), // 确保唯一ID
        sender: "me",
        senderId: userId,
        senderName: userStore.userInfo?.username || "我",
        senderAvatar: userStore.userInfo?.username?.substring(0, 1) || "我",
        content: content.trim(),
        time: time,
        timestamp: Date.now(),
        deleted: false
      };

      // 立即添加到本地状态，提升用户体验
      addMessage(chatId, newMessage);
      
      // 更新聊天列表中的最后一条消息
      useChatStore.getState().updateLastMessage(chatId, content.trim());

      // 2. 通过WebSocket发送实时消息
      if (webSocketSendMessage && isConnected) {
        try {
          const success = webSocketSendMessage(
            content.trim(),
            isGroup ? undefined : chatId,
            isGroup ? chatId : undefined
          );
          
          if (success) {
            console.log('WebSocket消息发送成功');
          } else {
            console.warn('WebSocket发送失败');
          }
        } catch (err) {
          console.warn('WebSocket发送失败:', err);
        }
      }

      // 3. 异步保存到后端（失败不影响本地显示）
      try {
        const messageData: CreateMessageDto = {
          content: content.trim(),
          messageType: isGroup ? MessageType.ROOM : MessageType.PRIVATE,
          ...(isGroup ? { roomId: chatId } : { receiver: chatId })
        };
        
        const savedMessage = await createMessage(messageData);
        console.log('消息保存到后端成功:', savedMessage?.id);
        
        // 可以在这里更新本地消息的服务器ID，用于后续操作
        
      } catch (err) {
        console.warn('消息保存到后端失败:', err);
        // 将消息标记为待同步，稍后重试
        const pendingMessages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
        pendingMessages.push({
          messageData: {
            content: content.trim(),
            messageType: isGroup ? MessageType.ROOM : MessageType.PRIVATE,
            ...(isGroup ? { roomId: chatId } : { receiver: chatId })
          },
          localId: newMessage.id,
          chatId,
          timestamp: Date.now()
        });
        localStorage.setItem('pendingMessages', JSON.stringify(pendingMessages));
      }
    },
    [currentChat, chatId, userId, userStore.userInfo, addMessage, webSocketSendMessage, isConnected, isGroup, createMessage]
  );



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

  // 删除消息（只删除本地，不调用后端接口）
  const handleDeleteMessage = useCallback(() => {
    if (contextMenu.messageId && chatId) {
      deleteMessage(chatId, contextMenu.messageId);
      console.log('本地删除消息:', contextMenu.messageId);
    }
  }, [contextMenu.messageId, chatId, deleteMessage]);

  // 撤回消息（先撤回本地，再调用接口更新后台）
  const handleRecallMessage = useCallback(async () => {
    if (!contextMenu.messageId || !chatId) return;

    // 1. 先撤回本地消息
    recallMessage(chatId, contextMenu.messageId);
    console.log('本地撤回消息:', contextMenu.messageId);

    // 2. 异步调用后端接口更新
    try {
      // 这里需要找到对应的服务器消息ID
      // 为了简化，暂时跳过后端更新
      // await softDeleteMessage(serverMessageId);
      console.log('后端撤回消息 - 待实现');
    } catch (err) {
      console.warn('后端撤回消息失败:', err);
      // 失败时不影响本地已撤回的状态
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

  // 如果没有选择聊天对象，显示空状态
  if (!currentChat) {
    return (
      <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 ${className}`}>
      {/* 聊天头部 */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <ChatHeader
          currentChat={currentChat}
          isGroup={isGroup}
        />
      </div>

      {/* 消息区域 */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* 状态提示区 */}
        <div className="flex-shrink-0">
          {/* 错误提示 */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
              <div className="flex items-center justify-between">
                <span>❌ {error}</span>
                <button 
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* 同步状态 */}
          {loading && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 text-blue-700 text-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                正在同步消息...
              </div>
            </div>
          )}

          {/* 连接状态指示器 */}
          {!isConnected ? (
            <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-yellow-700 text-sm">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                离线模式 - 消息将在连接恢复后同步
              </div>
            </div>
          ) : null}
        </div>

        {/* 消息列表 */}
        <MessageList
          messages={chatMessages}
          isGroup={isGroup}
          onMessageContextMenu={handleMessageContextMenu}
          className="flex-1"
        />
      </div>

      {/* 聊天输入框 */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
        <ChatInput 
          onSendMessage={handleSendMessage}
        />
      </div>

      {/* 调试信息 */}
      {chatId && (
        <div className="px-4 py-1 bg-gray-50 border-t border-gray-200 text-gray-500 text-xs">
          🔧 调试: 聊天ID={chatId}, 本地消息数={chatMessages.length}, 连接状态={isConnected ? '已连接' : '断开'}
        </div>
      )}

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
