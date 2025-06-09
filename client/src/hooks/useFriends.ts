import { useState, useEffect, useCallback } from 'react';
import { friendApi, Friend } from '../utils/friend';

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const friendsList = await friendApi.getFriendsList();
      // 确保返回的是数组
      if (Array.isArray(friendsList)) {
        setFriends(friendsList);
      } else {
        console.warn('好友列表API返回的不是数组:', friendsList);
        setFriends([]);
      }
    } catch (err: unknown) {
      console.error('加载好友列表失败:', err);
      setError('加载好友列表失败，请稍后重试');
      setFriends([]); // 确保在错误时设置为空数组
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFriend = useCallback(async (friendId: string) => {
    try {
      await friendApi.deleteFriend(friendId);
      setFriends(prev => prev.filter(friend => friend.id !== friendId));
      return true;
    } catch (err: unknown) {
      console.error('删除好友失败:', err);
      throw new Error('删除好友失败，请稍后重试');
    }
  }, []);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  return {
    friends,
    loading,
    error,
    loadFriends,
    deleteFriend,
  };
}; 