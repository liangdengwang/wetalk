import { useState, useEffect, useCallback } from 'react';
import { userApi, User, EditUserDTO } from '../utils/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载当前用户信息
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userProfile = await userApi.getProfile();
      setUser(userProfile);
    } catch (err: unknown) {
      console.error('加载用户信息失败:', err);
      setError('加载用户信息失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新用户信息
  const updateUser = useCallback(async (userData: EditUserDTO) => {
    try {
      const updatedUser = await userApi.updateUser(userData);
      setUser(updatedUser);
      return true;
    } catch (err: unknown) {
      console.error('更新用户信息失败:', err);
      throw new Error('更新用户信息失败，请稍后重试');
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user,
    loading,
    error,
    loadProfile,
    updateUser,
  };
}; 