import React, { useState, useEffect } from 'react';
import { useWebSocketChat } from '../hooks/useWebSocketChat';
import { useUserStore } from '../store';

const TestWebSocket: React.FC = () => {
  const [message, setMessage] = useState('');
  const [receiver, setReceiver] = useState('');
  const [groupId, setGroupId] = useState('');
  const [messageType, setMessageType] = useState<'private' | 'group'>('private');
  const [logs, setLogs] = useState<string[]>([]);

  const userStore = useUserStore();
  const username = userStore.userInfo?.username;

  const {
    isConnected,
    isConnecting,
    connectionError,
    sendMessage,
    clearError,
  } = useWebSocketChat({
    autoConnect: true,
    onConnectionError: (error) => {
      addLog(`连接错误: ${error.message}`);
    },
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    if (isConnected) {
      addLog('WebSocket连接成功');
    }
  }, [isConnected]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const success = sendMessage(
      message,
      messageType === 'private' ? receiver : undefined,
      messageType === 'group' ? groupId : undefined
    );

    if (success) {
      addLog(`发送消息: ${message} (${messageType === 'private' ? `给 ${receiver}` : `群组 ${groupId}`})`);
      setMessage('');
    } else {
      addLog('发送消息失败');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">WebSocket 实时通信测试</h1>
        
        {/* 连接状态 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">连接状态</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">当前用户:</span>
              <span className="text-blue-600">{username || '未登录'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">连接状态:</span>
              <span className={`px-2 py-1 rounded text-sm ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : isConnecting 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? '已连接' : isConnecting ? '连接中...' : '未连接'}
              </span>
            </div>
            {connectionError && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-red-600">错误:</span>
                <span className="text-red-600">{connectionError}</span>
                <button
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 underline"
                >
                  清除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 发送消息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">发送消息</h2>
          
          {/* 消息类型选择 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">消息类型</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="private"
                  checked={messageType === 'private'}
                  onChange={(e) => setMessageType(e.target.value as 'private')}
                  className="mr-2"
                />
                私聊
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="group"
                  checked={messageType === 'group'}
                  onChange={(e) => setMessageType(e.target.value as 'group')}
                  className="mr-2"
                />
                群聊
              </label>
            </div>
          </div>

          {/* 接收者/群组ID */}
          {messageType === 'private' ? (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                接收者用户名
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="输入接收者的用户名"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                群组ID
              </label>
              <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="输入群组ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* 消息内容 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              消息内容
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入消息内容..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !message.trim() || (messageType === 'private' ? !receiver : !groupId)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            发送消息
          </button>
        </div>

        {/* 日志 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">操作日志</h2>
            <button
              onClick={() => setLogs([])}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              清空日志
            </button>
          </div>
          <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500">暂无日志</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-700 mb-1 font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
          <div className="text-blue-800 space-y-2">
            <p>1. 确保已登录并且WebSocket连接成功</p>
            <p>2. 选择消息类型（私聊或群聊）</p>
            <p>3. 输入接收者用户名或群组ID</p>
            <p>4. 输入消息内容并发送</p>
            <p>5. 在另一个浏览器窗口或设备上登录另一个账号来测试实时通信</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestWebSocket; 