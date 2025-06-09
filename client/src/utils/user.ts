import api from './api';

// 用户接口定义
export interface User {
  _id: string;
  user_name: string;
  password?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 编辑用户DTO
export interface EditUserDTO {
  user_name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  password?: string;
}

// 用户搜索结果
export interface UserSearchResult {
  _id: string;
  user_name: string;
  avatar?: string;
  email?: string;
}

// 用户相关的API函数
export const userApi = {
  // 获取当前登录用户信息
  async getProfile(): Promise<User> {
    const response = await api.get('/user/profile');
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || '获取用户信息失败');
  },

  // 根据用户名查找用户
  async findUserByName(userName: string): Promise<User> {
    const response = await api.get('/user/findOne', {
      params: { user_name: userName }
    });
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || '查找用户失败');
  },

  // 获取所有用户（用于搜索）
  async getAllUsers(): Promise<User[]> {
    const response = await api.get('/user/users');
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      return Array.isArray(response.data.data) ? response.data.data : [];
    }
    throw new Error(response.data?.message || '获取用户列表失败');
  },

  // 更新用户信息
  async updateUser(userData: EditUserDTO): Promise<User> {
    const response = await api.post('/user/upd', userData);
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200 && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || '更新用户信息失败');
  },

  // 删除用户
  async deleteUser(userName: string): Promise<boolean> {
    const response = await api.post('/user/del', { user_name: userName });
    // 处理嵌套数据结构 {code, data, message}
    if (response.data && response.data.code === 200) {
      return response.data.data?.deleted || false;
    }
    throw new Error(response.data?.message || '删除用户失败');
  },

  // 搜索用户（根据用户名或ID）
  async searchUsers(query: string): Promise<UserSearchResult[]> {
    try {
      // 首先尝试获取所有用户，然后在前端过滤
      const allUsers = await this.getAllUsers();
      
      // 过滤用户：支持用户名模糊搜索或精确ID匹配
      const filteredUsers = allUsers.filter(user => 
        user.user_name.toLowerCase().includes(query.toLowerCase()) ||
        user._id === query
      );

      return filteredUsers.map(user => ({
        _id: user._id,
        user_name: user.user_name,
        avatar: user.avatar,
        email: user.email
      }));
    } catch (error) {
      console.error('搜索用户失败:', error);
      return [];
    }
  }
}; 