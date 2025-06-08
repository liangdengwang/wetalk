import { useEffect, useCallback, useState, useRef } from 'react';
import { webSocketManager } from '../services/websocket';
import { useUserStore } from '../store';
import useChatStore, { Message } from '../store/chatStore';
import { 
  MessageReceived, 
  MessageSent, 
  UserStatus, 
  FriendRequest,
  FriendStatus,
  GroupMemberChange,
  ErrorMessage 
} from '../types/websocket';

interface UseWebSocketChatOptions {
  // 是否自动连接
  autoConnect?: boolean;
  // 连接错误时的回调
  onConnectionError?: (error: Error) => void;
  // 是否在页面不可见时断开连接
  disconnectOnHidden?: boolean;
}

export const useWebSocketChat = (options: UseWebSocketChatOptions = {}) => {
  const { 
    autoConnect = true, 
    onConnectionError,
    disconnectOnHidden = false 
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const userStore = useUserStore();
  const token = userStore.userInfo?.token;
  const username = userStore.userInfo?.username;
  
  // 聊天store方法
  const addMessage = useChatStore((state) => state.addMessage);
  const addOrUpdateChatItem = useChatStore((state) => state.addOrUpdateChatItem);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  
  // 用于存储事件处理器的引用，防止重复绑定
  const handlersRef = useRef<Set<string>>(new Set());

  /**
   * 连接到WebSocket
   */
  const connect = useCallback(async () => {
    if (!token || isConnecting || webSocketManager.isConnected()) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      await webSocketManager.connect(token);
      setIsConnected(true);
      console.log('WebSocket聊天服务连接成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '连接失败';
      setConnectionError(errorMessage);
      onConnectionError?.(error instanceof Error ? error : new Error(errorMessage));
      console.error('WebSocket聊天服务连接失败:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [token, isConnecting, onConnectionError]);

  /**
   * 断开WebSocket连接
   */
  const disconnect = useCallback(() => {
    webSocketManager.disconnect();
    setIsConnected(false);
    setConnectionError(null);
    handlersRef.current.clear();
  }, []);

  /**
   * 发送聊天消息
   * 注意：这个方法只负责通过WebSocket发送消息，不处理本地消息添加
   * 本地消息添加应该在调用方处理，避免重复添加
   */
  const sendMessage = useCallback((content: string, receiver?: string, groupId?: string) => {
    if (!webSocketManager.isConnected()) {
      console.error('WebSocket未连接，无法发送消息');
      return false;
    }

    if (!username) {
      console.error('用户信息不完整，无法发送消息');
      return false;
    }

    try {
      webSocketManager.sendMessage({
        content,
        sender: username,
        receiver,
        groupId,
      });

      console.log('WebSocket消息发送成功');
      return true;
    } catch (error) {
      console.error('发送消息失败:', error);
      return false;
    }
  }, [username]);

  /**
   * 重新加载群组
   */
  const reloadGroups = useCallback(() => {
    webSocketManager.reloadGroups();
  }, []);

  /**
   * 设置事件监听器
   */
  const setupEventListeners = useCallback(() => {
    // 防止重复绑定
    if (handlersRef.current.has('message_listeners')) {
      return;
    }

    // 接收消息处理
    const handleReceiveMessage = (message: MessageReceived) => {
      console.log('处理接收到的消息:', message);
      
      const { content, sender, groupId, time, isGroup } = message;
      
      // 确定聊天ID
      const chatId = groupId || sender;
      
      // 如果是自己发送的消息，不需要重复添加
      if (sender === username) {
        return;
      }

      // 创建消息对象
      const newMessage: Message = {
        id: Date.now(),
        sender: "other",
        senderId: sender,
        senderName: sender, // 这里可以根据需要从用户信息中获取显示名称
        content,
        time: time ? new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) : new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: Date.now(),
      };

      // 添加消息到store
      addMessage(chatId, newMessage);

      // 更新或添加聊天项
      addOrUpdateChatItem({
        id: chatId,
        name: sender, // 可以根据需要优化显示名称
        avatar: sender.charAt(0).toUpperCase(),
        isGroup: isGroup || false,
      });

      // 更新最后一条消息
      updateLastMessage(chatId, content);
    };

    // 消息发送确认处理
    const handleMessageSent = (data: MessageSent) => {
      console.log('消息发送确认:', data);
      // 这里可以更新消息状态，比如显示"已发送"状态
    };

    // 用户状态变化处理
    const handleUserStatus = (status: UserStatus) => {
      console.log('用户状态变化:', status);
      // 这里可以更新用户在线状态显示
    };

    // 好友请求处理
    const handleFriendRequest = (request: FriendRequest) => {
      console.log('收到好友请求:', request);
      // 这里可以显示好友请求通知
    };

    // 好友状态变化处理
    const handleFriendStatus = (status: FriendStatus) => {
      console.log('好友状态变化:', status);
      // 这里可以更新好友在线状态
    };

    // 群组成员变化处理
    const handleGroupMemberChange = (change: GroupMemberChange) => {
      console.log('群组成员变化:', change);
      // 这里可以更新群组成员列表
    };

    // 错误处理
    const handleError = (error: ErrorMessage) => {
      console.error('WebSocket错误:', error);
      setConnectionError(error.message);
    };

    // 绑定事件监听器
    webSocketManager.on('receive_message', handleReceiveMessage);
    webSocketManager.on('message_sent', handleMessageSent);
    webSocketManager.on('user_status', handleUserStatus);
    webSocketManager.on('friend_request', handleFriendRequest);
    webSocketManager.on('friend_status', handleFriendStatus);
    webSocketManager.on('group_member_change', handleGroupMemberChange);
    webSocketManager.on('error', handleError);

    handlersRef.current.add('message_listeners');

    // 返回清理函数
    return () => {
      webSocketManager.off('receive_message', handleReceiveMessage);
      webSocketManager.off('message_sent', handleMessageSent);
      webSocketManager.off('user_status', handleUserStatus);
      webSocketManager.off('friend_request', handleFriendRequest);
      webSocketManager.off('friend_status', handleFriendStatus);
      webSocketManager.off('group_member_change', handleGroupMemberChange);
      webSocketManager.off('error', handleError);
      handlersRef.current.delete('message_listeners');
    };
  }, [username, addMessage, addOrUpdateChatItem, updateLastMessage]);

  // 处理页面可见性变化
  useEffect(() => {
    if (!disconnectOnHidden) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        disconnect();
      } else if (token && autoConnect) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [disconnect, connect, token, autoConnect, disconnectOnHidden]);

  // 自动连接和设置事件监听器
  useEffect(() => {
    if (token && autoConnect && !webSocketManager.isConnected() && !isConnecting) {
      connect();
    }

    // 设置事件监听器
    const cleanup = setupEventListeners();

    return cleanup;
  }, [token, autoConnect, connect, isConnecting, setupEventListeners]);

  // 页面卸载时断开连接
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // 监听连接状态变化
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(webSocketManager.isConnected());
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    // 连接状态
    isConnected,
    isConnecting,
    connectionError,
    
    // 连接控制
    connect,
    disconnect,
    
    // 消息功能
    sendMessage,
    reloadGroups,
    
    // 工具方法
    clearError: () => setConnectionError(null),
  };
}; 