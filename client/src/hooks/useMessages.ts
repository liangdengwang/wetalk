import { useState, useCallback } from 'react';
import { messageApi, Message, CreateMessageDto, UpdateMessageDto, GetMessageQueryDto } from '../utils/message';

// 消息状态管理Hook
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 创建消息
  const createMessage = useCallback(async (data: CreateMessageDto): Promise<Message | null> => {
    try {
      setLoading(true);
      setError(null);
      const message = await messageApi.createMessage(data);
      // 添加到本地消息列表
      setMessages(prev => [message, ...prev]);
      return message;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '创建消息失败';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取私聊消息
  const getPrivateMessages = useCallback(async (
    otherUserId: string, 
    limit = 50, 
    skip = 0,
    append = false
  ): Promise<Message[]> => {
    try {
      setLoading(true);
      setError(null);
      const newMessages = await messageApi.getPrivateMessages(otherUserId, limit, skip);
      if (append) {
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(newMessages);
      }
      return newMessages;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '获取私聊消息失败';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取群组消息
  const getGroupMessages = useCallback(async (
    groupId: string, 
    limit = 50, 
    skip = 0,
    append = false
  ): Promise<Message[]> => {
    try {
      setLoading(true);
      setError(null);
      const newMessages = await messageApi.getGroupMessages(groupId, limit, skip);
      if (append) {
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(newMessages);
      }
      return newMessages;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '获取群组消息失败';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 标记消息为已读
  const markAsRead = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const success = await messageApi.markAsRead(messageId);
      if (success) {
        // 更新本地消息状态
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, readStatus: true } : msg
        ));
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '标记已读失败';
      setError(errorMsg);
      return false;
    }
  }, []);

  // 标记对话为已读
  const markConversationAsRead = useCallback(async (
    otherUserId?: string, 
    groupId?: string
  ): Promise<number> => {
    try {
      const count = await messageApi.markConversationAsRead(otherUserId, groupId);
      // 更新本地消息状态
      if (count > 0) {
        setMessages(prev => prev.map(msg => ({ ...msg, readStatus: true })));
      }
      return count;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '标记对话已读失败';
      setError(errorMsg);
      return 0;
    }
  }, []);

  // 软删除消息
  const softDeleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const success = await messageApi.softDeleteMessage(messageId);
      if (success) {
        // 更新本地消息状态
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, isDeleted: true } : msg
        ));
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '删除消息失败';
      setError(errorMsg);
      return false;
    }
  }, []);

  // 硬删除消息
  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    try {
      const success = await messageApi.deleteMessage(messageId);
      if (success) {
        // 从本地消息列表中移除
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '删除消息失败';
      setError(errorMsg);
      return false;
    }
  }, []);

  // 更新消息
  const updateMessage = useCallback(async (messageId: string, data: UpdateMessageDto): Promise<Message | null> => {
    try {
      const updatedMessage = await messageApi.updateMessage(messageId, data);
      // 更新本地消息
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? updatedMessage : msg
      ));
      return updatedMessage;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '更新消息失败';
      setError(errorMsg);
      return null;
    }
  }, []);

  // 查询消息
  const queryMessages = useCallback(async (query: GetMessageQueryDto): Promise<Message[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await messageApi.queryMessages(query);
      setMessages(results);
      return results;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '查询消息失败';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 清空消息
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // 添加消息到本地列表（用于实时消息）
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [message, ...prev]);
  }, []);

  return {
    messages,
    loading,
    error,
    clearError,
    createMessage,
    getPrivateMessages,
    getGroupMessages,
    markAsRead,
    markConversationAsRead,
    softDeleteMessage,
    deleteMessage,
    updateMessage,
    queryMessages,
    clearMessages,
    addMessage
  };
};

// 未读消息数量Hook
export const useUnreadCount = () => {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取未读消息数量
  const getUnreadCount = useCallback(async (
    key: string, // 用于标识对话的唯一键
    otherUserId?: string, 
    groupId?: string
  ): Promise<number> => {
    try {
      setLoading(true);
      setError(null);
      const count = await messageApi.getUnreadCount(otherUserId, groupId);
      setUnreadCounts(prev => ({ ...prev, [key]: count }));
      return count;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '获取未读数量失败';
      setError(errorMsg);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  // 批量获取未读数量
  const getBatchUnreadCounts = useCallback(async (
    requests: Array<{ key: string; otherUserId?: string; groupId?: string }>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const results = await Promise.allSettled(
        requests.map(async ({ key, otherUserId, groupId }) => {
          const count = await messageApi.getUnreadCount(otherUserId, groupId);
          return { key, count };
        })
      );

      const newCounts: Record<string, number> = {};
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          newCounts[result.value.key] = result.value.count;
        }
      });

      setUnreadCounts(prev => ({ ...prev, ...newCounts }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '批量获取未读数量失败';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 清除指定对话的未读数量
  const clearUnreadCount = useCallback((key: string) => {
    setUnreadCounts(prev => ({ ...prev, [key]: 0 }));
  }, []);

  // 获取指定对话的未读数量
  const getCount = useCallback((key: string): number => {
    return unreadCounts[key] || 0;
  }, [unreadCounts]);

  return {
    unreadCounts,
    loading,
    error,
    getUnreadCount,
    getBatchUnreadCounts,
    clearUnreadCount,
    getCount
  };
}; 