import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserStore } from '../store';
import { Message, MessageType } from '../utils/message';

interface UseWebSocketProps {
  onMessageReceived?: (message: Message) => void;
  onUserStatusChanged?: (userId: string, status: string) => void;
  onTypingStatusChanged?: (userId: string, isTyping: boolean) => void;
}

export const useWebSocket = ({
  onMessageReceived,
  onUserStatusChanged,
  onTypingStatusChanged
}: UseWebSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);
  const userStore = useUserStore();
  const userId = userStore.userInfo?.userId;
  const token = userStore.userInfo?.token;

  // 连接WebSocket
  const connect = useCallback(() => {
    if (!userId || !token || socketRef.current?.connected) return;

    console.log('Connecting to WebSocket...');
    
    socketRef.current = io(import.meta.env.VITE_WS_URL || 'ws://localhost:3001', {
      auth: {
        token,
        userId
      },
      transports: ['websocket']
    });

    const socket = socketRef.current;

    // 连接成功
    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    // 连接失败
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // 断开连接
    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    // 接收新消息
    socket.on('newMessage', (message: Message) => {
      console.log('Received new message:', message);
      onMessageReceived?.(message);
    });

    // 用户状态变化
    socket.on('userStatusChanged', ({ userId: changedUserId, status }: { userId: string; status: string }) => {
      console.log('User status changed:', changedUserId, status);
      onUserStatusChanged?.(changedUserId, status);
    });

    // 用户正在输入状态
    socket.on('userTyping', ({ userId: typingUserId, isTyping }: { userId: string; isTyping: boolean }) => {
      console.log('User typing status:', typingUserId, isTyping);
      onTypingStatusChanged?.(typingUserId, isTyping);
    });

    // 消息已读回执
    socket.on('messageRead', ({ messageId, userId: readUserId }: { messageId: string; userId: string }) => {
      console.log('Message read:', messageId, readUserId);
      // 这里可以处理消息已读状态的更新
    });

  }, [userId, token, onMessageReceived, onUserStatusChanged, onTypingStatusChanged]);

  // 断开连接
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      console.log('WebSocket disconnected manually');
    }
  }, []);

  // 发送消息
  const sendMessage = useCallback((message: {
    content: string;
    receiver?: string;
    groupId?: string;
    messageType: MessageType;
  }) => {
    if (!socketRef.current?.connected) {
      console.error('WebSocket not connected');
      return false;
    }

    socketRef.current.emit('sendMessage', {
      ...message,
      sender: userId,
      timestamp: Date.now()
    });

    return true;
  }, [userId]);

  // 发送输入状态
  const sendTypingStatus = useCallback((isTyping: boolean, receiverId?: string, groupId?: string) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('typing', {
      isTyping,
      receiverId,
      groupId,
      userId
    });
  }, [userId]);

  // 发送用户状态
  const sendUserStatus = useCallback((status: 'online' | 'busy' | 'idle' | 'offline') => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('userStatus', {
      status,
      userId
    });
  }, [userId]);

  // 加入群组
  const joinGroup = useCallback((groupId: string) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('joinGroup', { groupId });
  }, []);

  // 离开群组
  const leaveGroup = useCallback((groupId: string) => {
    if (!socketRef.current?.connected) return;

    socketRef.current.emit('leaveGroup', { groupId });
  }, []);

  // 组件挂载时连接
  useEffect(() => {
    if (userId && token) {
      connect();
    }

    // 组件卸载时断开连接
    return () => {
      disconnect();
    };
  }, [userId, token, connect, disconnect]);

  // 窗口关闭时断开连接
  useEffect(() => {
    const handleBeforeUnload = () => {
      disconnect();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [disconnect]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
    connect,
    disconnect,
    sendMessage,
    sendTypingStatus,
    sendUserStatus,
    joinGroup,
    leaveGroup
  };
}; 