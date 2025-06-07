import api from './api';

// 消息类型枚举 - 与后端保持一致
export enum MessageType {
  PRIVATE = 'private',
  ROOM = 'room'  // 后端使用'room'表示群聊，不是'group'
}

// 后端返回的消息数据格式
export interface MessageData {
  _id: string;
  content: string;
  sender: string;
  receiver?: string;
  roomId?: string;
  messageType: MessageType;
  createdAt: string;
  senderInfo?: {
    user_name: string;
    avatar: string;
  };
  receiverInfo?: {
    user_name: string;
    avatar: string;
  };
  groupInfo?: {
    name: string;
    avatar: string;
  };
  readStatus: boolean;
  isDeleted: boolean;
}

// 前端使用的消息类型
export interface Message {
  id: string;
  content: string;
  sender: string;
  receiver?: string;
  roomId?: string;
  messageType: MessageType;
  createdAt: string;
  senderInfo?: {
    username: string;
    avatar: string;
  };
  receiverInfo?: {
    username: string;
    avatar: string;
  };
  groupInfo?: {
    name: string;
    avatar: string;
  };
  readStatus: boolean;
  isDeleted: boolean;
  timestamp: number; // 时间戳，用于本地处理
}

// 创建消息的DTO
export interface CreateMessageDto {
  content: string;
  receiver?: string;
  roomId?: string;
  messageType: MessageType;
  senderInfo?: {
    user_name: string;
    avatar: string;
  };
  receiverInfo?: {
    user_name: string;
    avatar: string;
  };
  groupInfo?: {
    name: string;
    avatar: string;
  };
}

// 更新消息的DTO
export interface UpdateMessageDto {
  content?: string;
  readStatus?: boolean;
  isDeleted?: boolean;
}

// 查询消息的DTO
export interface GetMessageQueryDto {
  messageType?: MessageType;
  roomId?: string;
  sender?: string;
  receiver?: string;
  unreadOnly?: boolean;
  includeDeleted?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}

// 数据转换函数：将后端消息数据转换为前端格式
const convertMessageData = (data: MessageData): Message => {
  return {
    id: data._id,
    content: data.content,
    sender: data.sender,
    receiver: data.receiver,
    roomId: data.roomId,
    messageType: data.messageType,
    createdAt: data.createdAt,
    senderInfo: data.senderInfo ? {
      username: data.senderInfo.user_name,
      avatar: data.senderInfo.avatar
    } : undefined,
    receiverInfo: data.receiverInfo ? {
      username: data.receiverInfo.user_name,
      avatar: data.receiverInfo.avatar
    } : undefined,
    groupInfo: data.groupInfo,
    readStatus: data.readStatus,
    isDeleted: data.isDeleted,
    timestamp: new Date(data.createdAt).getTime()
  };
};

// 消息相关的API函数
export const messageApi = {
  // 创建新消息
  async createMessage(data: CreateMessageDto): Promise<Message> {
    const response = await api.post('/messages', data);
    // 处理嵌套数据结构 {message: data}
    if (response.data && response.data.message) {
      return convertMessageData(response.data.message);
    }
    throw new Error('创建消息失败');
  },

  // 获取私聊消息历史
  async getPrivateMessages(
    otherUserId: string, 
    limit = 50, 
    skip = 0
  ): Promise<Message[]> {
    const response = await api.get(`/messages/private/${otherUserId}`, {
      params: { limit, skip }
    });
    // 处理嵌套数据结构 {messages: data}
    if (response.data && response.data.messages) {
      const rawData = Array.isArray(response.data.messages) ? response.data.messages : [];
      return rawData.map(convertMessageData);
    }
    throw new Error('获取私聊消息失败');
  },

  // 获取群组消息历史 (后端路由是 group/:groupId，但实际存储字段是roomId)
  async getGroupMessages(
    roomId: string, 
    limit = 50, 
    skip = 0
  ): Promise<Message[]> {
    const response = await api.get(`/messages/group/${roomId}`, {
      params: { limit, skip }
    });
    // 处理嵌套数据结构 {messages: data}
    if (response.data && response.data.messages) {
      const rawData = Array.isArray(response.data.messages) ? response.data.messages : [];
      return rawData.map(convertMessageData);
    }
    throw new Error('获取群组消息失败');
  },

  // 获取未读消息数量
  async getUnreadCount(
    otherUserId?: string, 
    groupId?: string
  ): Promise<number> {
    const params: Record<string, string> = {};
    if (otherUserId) params.otherUserId = otherUserId;
    if (groupId) params.groupId = groupId;  // 后端接口用的是groupId参数
    
    const response = await api.get('/messages/unread/count', { params });
    // 处理嵌套数据结构 {count: number}
    if (response.data && typeof response.data.count === 'number') {
      return response.data.count;
    }
    return 0;
  },

  // 标记消息为已读
  async markAsRead(messageId: string): Promise<boolean> {
    const response = await api.patch(`/messages/${messageId}/read`, {});
    // 处理嵌套数据结构 {success: boolean}
    return response.data?.success || false;
  },

  // 标记整个对话为已读
  async markConversationAsRead(
    otherUserId?: string, 
    groupId?: string
  ): Promise<number> {
    const params: Record<string, string> = {};
    if (otherUserId) params.otherUserId = otherUserId;
    if (groupId) params.groupId = groupId;
    
    try {
      const response = await api.patch('/messages/conversation/read', {}, { params });
      // 处理嵌套数据结构 {count: number}
      return response.data?.count || 0;
    } catch (error) {
      console.error('标记对话已读失败:', error);
      // 如果API调用失败，返回0而不是抛出错误
      return 0;
    }
  },

  // 更新消息状态
  async updateMessage(messageId: string, data: UpdateMessageDto): Promise<Message> {
    const response = await api.put(`/messages/${messageId}`, data);
    // 处理嵌套数据结构 {message: data}
    if (response.data && response.data.message) {
      return convertMessageData(response.data.message);
    }
    throw new Error('更新消息失败');
  },

  // 软删除消息
  async softDeleteMessage(messageId: string): Promise<boolean> {
    const response = await api.delete(`/messages/${messageId}/soft`);
    // 处理嵌套数据结构 {success: boolean}
    return response.data?.success || false;
  },

  // 硬删除消息
  async deleteMessage(messageId: string): Promise<boolean> {
    const response = await api.delete(`/messages/${messageId}`);
    // 检查是否有错误消息
    return !response.data?.error;
  },

  // 高级查询消息
  async queryMessages(query: GetMessageQueryDto): Promise<Message[]> {
    const response = await api.get('/messages', { params: query });
    // 处理嵌套数据结构 {messages: data}
    if (response.data && response.data.messages) {
      const rawData = Array.isArray(response.data.messages) ? response.data.messages : [];
      return rawData.map(convertMessageData);
    }
    throw new Error('查询消息失败');
  }
}; 