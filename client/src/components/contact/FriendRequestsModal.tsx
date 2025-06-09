import React, { useState, useEffect } from 'react';
import { X, Check, Users, Clock, UserCheck, UserX } from 'lucide-react';
import { 
  friendApi, 
  FriendRequest, 
  FriendRequestStatus,
  UpdateFriendRequestDto 
} from '../../utils/friend';
import TabBar, { TabItem } from '../common/TabBar';
import Avatar from '../common/Avatar';

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const FriendRequestsModal: React.FC<FriendRequestsModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const tabs: TabItem[] = [
    { id: "received", label: "收到的请求" },
    { id: "sent", label: "发送的请求" },
  ];

  // 加载好友请求数据
  const loadFriendRequests = async () => {
    setLoading(true);
    setError(null);

    try {
      const [received, sent] = await Promise.all([
        friendApi.getReceivedRequests(),
        friendApi.getSentRequests()
      ]);
      
      console.log('收到的好友请求:', received);
      console.log('发送的好友请求:', sent);
      
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (err: unknown) {
      console.error('加载好友请求失败:', err);
      setError('加载好友请求失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理好友请求（接受/拒绝）
  const handleRequestAction = async (requestId: string, status: FriendRequestStatus) => {
    setProcessingId(requestId);
    console.log(requestId, status);
    

    try {
      const updateData: UpdateFriendRequestDto = { status };
      await friendApi.updateFriendRequest(requestId, updateData);
      
      // 更新本地状态
      setReceivedRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status } 
            : req
        )
      );

      onSuccess?.();
    } catch (err: unknown) {
      console.error('处理好友请求失败:', err);
      setError('处理好友请求失败，请稍后重试');
    } finally {
      setProcessingId(null);
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;

    return date.toLocaleDateString();
  };

  // 获取状态显示
  const getStatusDisplay = (status: FriendRequestStatus) => {
    switch (status) {
      case FriendRequestStatus.PENDING:
        return { text: '待处理', color: 'text-yellow-600 dark:text-yellow-400', icon: Clock };
      case FriendRequestStatus.ACCEPTED:
        return { text: '已接受', color: 'text-green-600 dark:text-green-400', icon: UserCheck };
      case FriendRequestStatus.REJECTED:
        return { text: '已拒绝', color: 'text-red-600 dark:text-red-400', icon: UserX };
      default:
        return { text: '未知', color: 'text-gray-600 dark:text-gray-400', icon: Clock };
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFriendRequests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users size={20} />
            好友请求
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* 标签栏 */}
        <TabBar tabs={tabs} activeTab={activeTab} onChange={(tabId) => setActiveTab(tabId as "received" | "sent")} />

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="loading loading-spinner loading-lg text-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-red-500 text-center">
                <p className="text-lg font-bold mb-2">出错了</p>
                <p>{error}</p>
                <button
                  onClick={loadFriendRequests}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  重试
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {activeTab === "received" ? (
                <div className="space-y-3">
                  {receivedRequests.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      暂无收到的好友请求
                    </div>
                  ) : (
                    receivedRequests.map((request) => {
                      const statusDisplay = getStatusDisplay(request.status);
                      const StatusIcon = statusDisplay.icon;
                      
                      return (
                        <div
                          key={request.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              text={request.sender?.username?.charAt(0) || ''}
                              size="lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                  {request.sender?.username}
                                </h3>
                                <div className={`flex items-center gap-1 text-sm ${statusDisplay.color}`}>
                                  <StatusIcon size={14} />
                                  {statusDisplay.text}
                                </div>
                              </div>
                              {request.message && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {request.message}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {formatTime(request.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          {request.status === FriendRequestStatus.PENDING && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleRequestAction(request.id, FriendRequestStatus.ACCEPTED)}
                                disabled={processingId === request.id}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <Check size={16} />
                                接受
                              </button>
                              <button
                                onClick={() => handleRequestAction(request.id, FriendRequestStatus.REJECTED)}
                                disabled={processingId === request.id}
                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <X size={16} />
                                拒绝
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {sentRequests.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      暂无发送的好友请求
                    </div>
                  ) : (
                    sentRequests.map((request) => {
                      const statusDisplay = getStatusDisplay(request.status);
                      const StatusIcon = statusDisplay.icon;
                      
                      return (
                        <div
                          key={request.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                                                         <Avatar
                               text={request.receiver?.username?.charAt(0) || ''}
                               size="lg"
                             />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                  {request.receiver?.username}
                                </h3>
                                <div className={`flex items-center gap-1 text-sm ${statusDisplay.color}`}>
                                  <StatusIcon size={14} />
                                  {statusDisplay.text}
                                </div>
                              </div>
                              {request.message && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {request.message}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {formatTime(request.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRequestsModal; 