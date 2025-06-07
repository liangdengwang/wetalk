import api from './api';

// 好友请求状态枚举
export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

// 后端返回的好友请求数据格式
export interface FriendRequestData {
  _id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  sender?: {
    _id: string;
    user_name: string;
    avatar?: string;
  };
  receiver?: {
    _id: string;
    user_name: string;
    avatar?: string;
  };
}

// 前端使用的好友请求类型定义
export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  sender?: {
    id: string;
    username: string;
    avatar?: string;
  };
  receiver?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

// 后端返回的好友数据格式
export interface FriendData {
  _id: string;
  user_name: string;
  avatar?: string;
  status?: string;
  lastOnline?: string;
}

// 前端使用的好友类型定义
export interface Friend {
  id: string;
  username: string;
  avatar?: string;
  status?: string;
  lastOnline?: string;
}

// 创建好友请求的DTO
export interface CreateFriendRequestDto {
  receiverUsername: string;
  receiverId?: string;
  message?: string;
}

// 更新好友请求的DTO
export interface UpdateFriendRequestDto {
  status: FriendRequestStatus;
}

// 数据转换函数：将后端好友请求数据转换为前端格式
const convertFriendRequestData = (data: FriendRequestData): FriendRequest => {
  return {
    id: data._id,
    senderId: data.senderId,
    receiverId: data.receiverId,
    message: data.message,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    sender: data.sender ? {
      id: data.sender._id,
      username: data.sender.user_name,
      avatar: data.sender.avatar
    } : undefined,
    receiver: data.receiver ? {
      id: data.receiver._id,
      username: data.receiver.user_name,
      avatar: data.receiver.avatar
    } : undefined
  };
};

// 数据转换函数：将后端好友数据转换为前端格式
const convertFriendData = (data: FriendData): Friend => {
  return {
    id: data._id,
    username: data.user_name,
    avatar: data.avatar,
    status: data.status,
    lastOnline: data.lastOnline
  };
};

// 好友相关的API函数
export const friendApi = {
  // 发送好友请求
  async createFriendRequest(data: CreateFriendRequestDto): Promise<FriendRequest> {
    const response = await api.post('/friends/requests', data);
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      return convertFriendRequestData(response.data.data);
    }
    throw new Error(response.data?.message || '发送好友请求失败');
  },

  // 更新好友请求状态（接受/拒绝）
  async updateFriendRequest(id: string, data: UpdateFriendRequestDto): Promise<FriendRequest> {
    const response = await api.put(`/friends/requests/${id}`, data);
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      return convertFriendRequestData(response.data.data);
    }
    throw new Error(response.data?.message || '更新好友请求失败');
  },

  // 获取收到的好友请求
  async getReceivedRequests(): Promise<FriendRequest[]> {
    const response = await api.get('/friends/requests/received');
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      const rawData = Array.isArray(response.data.data) ? response.data.data : [];
      return rawData.map(convertFriendRequestData);
    }
    throw new Error(response.data?.message || '获取好友请求失败');
  },

  // 获取发送的好友请求
  async getSentRequests(): Promise<FriendRequest[]> {
    const response = await api.get('/friends/requests/sent');
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      const rawData = Array.isArray(response.data.data) ? response.data.data : [];
      return rawData.map(convertFriendRequestData);
    }
    throw new Error(response.data?.message || '获取发送的请求失败');
  },

  // 获取好友列表
  async getFriendsList(): Promise<Friend[]> {
    const response = await api.get('/friends');
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      const rawData = Array.isArray(response.data.data) ? response.data.data : [];
      return rawData.map(convertFriendData);
    }
    throw new Error(response.data?.message || '获取好友列表失败');
  },

  // 删除好友
  async deleteFriend(friendId: string): Promise<void> {
    const response = await api.delete(`/friends/${friendId}`);
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code !== 200) {
      throw new Error(response.data?.message || '删除好友失败');
    }
  },
}; 