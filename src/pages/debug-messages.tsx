import React, { useState, useEffect } from 'react';
import { useWebSocketChat } from '../hooks/useWebSocketChat';
import { useUserStore } from '../store';
import useChatStore from '../store/chatStore';

const DebugMessages: React.FC = () => {
  const [message, setMessage] = useState('');
  const [receiver, setReceiver] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  const userStore = useUserStore();
  const username = userStore.userInfo?.username;
  
  // 获取聊天store状态
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateLastMessage = useChatStore((state) => state.updateLastMessage);
  
  const {
    isConnected,
    sendMessage: webSocketSendMessage,
  } = useWebSocketChat({
    autoConnect: true,
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // 监听消息变化
  useEffect(() => {
    if (receiver && messages[receiver]) {
      addLog(`当前聊天 ${receiver} 的消息数量: ${messages[receiver].length}`);
    }
  }, [messages, receiver]);

  const handleSendMessage = () => {
    if (!message.trim() || !receiver.trim()) return;
    
    addLog(`准备发送消息: "${message}" 给 ${receiver}`);
    
    // 1. 先添加本地消息
    const newMessage = {
      id: Date.now(),
      sender: "me" as const,
      senderId: username,
      senderName: username,
      content: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: Date.now(),
    };
    
    addMessage(receiver, newMessage);
    updateLastMessage(receiver, message.trim());
    addLog(`本地消息已添加，ID: ${newMessage.id}`);
    
    // 2. 通过WebSocket发送
    if (isConnected && webSocketSendMessage) {
      const success = webSocketSendMessage(message.trim(), receiver);
      if (success) {
        addLog(`WebSocket发送成功`);
      } else {
        addLog(`WebSocket发送失败`);
      }
    } else {
      addLog(`WebSocket未连接，无法发送`);
    }
    
    setMessage('');
  };

  const currentMessages = receiver ? messages[receiver] || [] : [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">消息发送调试工具</h1>
        
        {/* 用户信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">用户信息</h2>
          <div className="space-y-2">
            <div><strong>当前用户:</strong> {username || '未登录'}</div>
            <div><strong>连接状态:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? '已连接' : '未连接'}
              </span>
            </div>
          </div>
        </div>

        {/* 发送消息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">发送消息测试</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                接收者用户名
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="输入接收者用户名"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                消息内容
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="输入消息内容"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !receiver.trim() || !isConnected}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              发送消息
            </button>
          </div>
        </div>

        {/* 当前聊天消息 */}
        {receiver && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              与 {receiver} 的消息 (共 {currentMessages.length} 条)
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentMessages.length === 0 ? (
                <p className="text-gray-500">暂无消息</p>
              ) : (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 rounded ${
                      msg.sender === 'me' 
                        ? 'bg-blue-100 text-blue-900 ml-auto max-w-xs' 
                        : 'bg-gray-100 text-gray-900 mr-auto max-w-xs'
                    }`}
                  >
                    <div className="text-sm">
                      <strong>{msg.sender === 'me' ? '我' : msg.senderName}:</strong> {msg.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.time} (ID: {msg.id})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 调试日志 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">调试日志</h2>
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
        <div className="bg-yellow-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">调试说明</h3>
          <div className="text-yellow-800 space-y-2">
            <p>1. 确保已登录并且WebSocket连接成功</p>
            <p>2. 输入接收者用户名（可以是任意用户名，用于测试）</p>
            <p>3. 输入消息内容并发送</p>
            <p>4. 观察消息是否只添加了一次（检查消息ID和数量）</p>
            <p>5. 查看调试日志了解详细的发送过程</p>
            <p><strong>预期结果:</strong> 每次发送只应该产生一条消息，不应该重复</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugMessages; 