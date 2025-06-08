import React from 'react';
import { Wifi, WifiOff, AlertCircle, X } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  onClearError: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  error,
  onClearError,
}) => {
  // 如果连接正常且没有错误，不显示状态栏
  if (isConnected && !error) {
    return null;
  }

  return (
    <div className="relative">
      {/* 连接状态栏 */}
      {(isConnecting || !isConnected) && (
        <div
          className={`px-4 py-2 text-sm flex items-center justify-center gap-2 ${
            isConnecting
              ? 'bg-blue-100 text-blue-700 border-blue-200'
              : 'bg-yellow-100 text-yellow-700 border-yellow-200'
          } border-b`}
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span>正在连接聊天服务...</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>聊天服务已断开，正在尝试重连...</span>
            </>
          )}
        </div>
      )}

      {/* 错误信息栏 */}
      {error && (
        <div className="px-4 py-2 bg-red-100 text-red-700 border-red-200 border-b text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>连接错误: {error}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-red-600 hover:text-red-800 p-1 rounded"
            title="关闭错误提示"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* 成功连接状态（短暂显示） */}
      {isConnected && !error && (
        <div className="px-4 py-2 bg-green-100 text-green-700 border-green-200 border-b text-sm flex items-center justify-center gap-2">
          <Wifi className="h-4 w-4" />
          <span>聊天服务已连接</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 