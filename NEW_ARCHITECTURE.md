# 新的WebSocket架构说明

## 概述

项目已完全重构为简化的WebSocket架构，遵循Socket.IO官方最佳实践。

## 核心文件

### 1. `src/socket.ts` - Socket实例
- 单一Socket.IO实例
- 手动连接控制
- 内置重连机制
- 服务器地址: `http://8.137.125.187:3000`

### 2. `src/hooks/useSocket.ts` - React Hook
- 标准React集成模式
- 自动事件监听器清理
- 消息发送和接收
- 连接状态管理

### 3. `src/store/simpleStore.ts` - 统一状态管理
- 好友列表和状态
- 聊天消息
- Socket连接状态
- 当前用户信息

### 4. `src/App.tsx` - 主应用
- 自动连接逻辑
- 状态同步
- 错误处理
- 视觉状态指示器

### 5. `src/components/test/SimpleSocketTest.tsx` - 测试组件
- 连接测试
- 消息发送测试
- 好友状态模拟
- 调试信息显示

## 使用方法

### 基本使用
```tsx
import { useSocket } from '../hooks/useSocket';
import { useAppStore } from '../store/simpleStore';

const MyComponent = () => {
  const { isConnected, sendMessage } = useSocket();
  const { friends, currentUser } = useAppStore();
  
  const handleSend = () => {
    sendMessage('Hello', 'friendId');
  };
  
  return (
    <div>
      <p>连接状态: {isConnected ? '已连接' : '未连接'}</p>
      <button onClick={handleSend}>发送消息</button>
    </div>
  );
};
```

### 手动连接
```tsx
const { connect, disconnect } = useSocket();

// 连接
const success = await connect('username', 'token');

// 断开
disconnect();
```

## 支持的事件

- `send_message` - 发送消息
- `receive_message` - 接收消息
- `user_status` - 用户状态更新
- `friend_status` - 好友状态更新
- `friend_request` - 好友请求

## 调试

1. 访问测试页面查看Socket状态
2. 浏览器控制台查看详细日志
3. 使用 `window.appStore` 查看状态

## 已删除的旧文件

- 所有旧的WebSocket hooks和stores
- 复杂的单例模式文件
- 紧急修复工具
- 旧的测试页面
- 各种修复指南文档

## 注意事项

- 项目现在使用简化的单一Socket连接
- 所有状态统一管理在simpleStore中
- 自动重连和错误处理已内置
- 支持Socket和HTTP API双重发送模式 