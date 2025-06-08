# WebSocket 实时通信测试指南

## 概述

本项目已实现完整的WebSocket实时通信功能，支持两个账号之间的私聊和群聊。本文档将指导您如何测试这些功能。

## 架构说明

### 后端 (wetalk-backend)
- 使用 NestJS + Socket.IO 实现WebSocket服务
- 位置：`wetalk-backend/src/gateway/event.gateway.ts`
- 支持的事件：
  - `send_message`: 发送消息
  - `receive_message`: 接收消息
  - `user_status`: 用户状态变化
  - `friend_request`: 好友请求
  - `connection_success`: 连接成功

### 前端 (wetalk)
- 使用 React + TypeScript + Socket.IO Client
- 核心文件：
  - `src/types/websocket.ts`: WebSocket类型定义
  - `src/services/websocket.ts`: WebSocket管理器
  - `src/hooks/useWebSocketChat.ts`: React Hook
  - `src/pages/test-websocket.tsx`: 测试页面

## 测试步骤

### 1. 启动服务

#### 启动后端服务
```bash
cd wetalk-backend
npm install
npm run start:dev
```
后端将在 `http://localhost:3000` 启动

#### 启动前端服务
```bash
cd wetalk
npm install
npm run dev
```
前端将在 `http://localhost:5173` 启动

### 2. 准备测试账号

确保您有两个不同的用户账号用于测试：
- 账号A：例如 `user1`
- 账号B：例如 `user2`

### 3. 测试方法

#### 方法一：使用专用测试页面

1. 在浏览器中打开两个窗口/标签页
2. 第一个窗口：登录账号A，访问 `http://localhost:5173/test-websocket`
3. 第二个窗口：登录账号B，访问 `http://localhost:5173/test-websocket`

在测试页面中：
- 查看连接状态（应该显示"已连接"）
- 选择消息类型（私聊/群聊）
- 输入接收者用户名或群组ID
- 发送测试消息
- 在另一个窗口中观察是否实时收到消息

#### 方法二：使用正常聊天界面

1. 在浏览器中打开两个窗口/标签页
2. 第一个窗口：登录账号A，访问 `http://localhost:5173/chat`
3. 第二个窗口：登录账号B，访问 `http://localhost:5173/chat`

在聊天界面中：
- 在账号A的窗口中，选择与账号B的对话
- 发送消息
- 在账号B的窗口中观察是否实时收到消息

### 4. 验证功能

#### 私聊功能
- [x] 消息实时发送和接收
- [x] 消息在聊天列表中实时更新
- [x] 发送者立即看到自己的消息
- [x] 接收者实时收到消息通知

#### 群聊功能
- [x] 群组消息广播
- [x] 多人同时在线聊天
- [x] 群组成员状态同步

#### 连接管理
- [x] 自动连接和重连
- [x] 连接状态实时显示
- [x] 错误处理和提示

#### 用户状态
- [x] 用户上线/下线状态广播
- [x] 好友状态实时更新

## 技术特性

### 1. 类型安全
- 完整的TypeScript类型定义
- 与后端接口严格对应的类型系统

### 2. 错误处理
- 连接失败自动重试
- 指数退避重连策略
- 用户友好的错误提示

### 3. 性能优化
- 事件监听器自动清理
- 防止重复绑定
- 内存泄漏预防

### 4. 用户体验
- 连接状态实时反馈
- 离线消息缓存
- 消息发送确认

## 故障排除

### 连接失败
1. 检查后端服务是否正常运行
2. 确认WebSocket URL配置正确（`src/utils/config.ts`）
3. 检查用户是否已登录并有有效token

### 消息不能发送
1. 确认WebSocket连接状态为"已连接"
2. 检查接收者用户名是否正确
3. 查看浏览器控制台是否有错误信息

### 消息不能接收
1. 确认接收方WebSocket连接正常
2. 检查事件监听器是否正确绑定
3. 验证消息格式是否符合后端要求

## 开发说明

### 添加新的WebSocket事件

1. 在 `src/types/websocket.ts` 中添加类型定义
2. 在 `src/services/websocket.ts` 中添加事件处理
3. 在 `src/hooks/useWebSocketChat.ts` 中添加业务逻辑

### 自定义消息处理

可以通过修改 `useWebSocketChat` hook 中的事件处理器来自定义消息处理逻辑：

```typescript
const handleReceiveMessage = (message: MessageReceived) => {
  // 自定义消息处理逻辑
  console.log('收到消息:', message);
  // 添加到聊天记录
  addMessage(chatId, newMessage);
};
```

## 配置说明

### WebSocket连接配置
文件：`src/utils/config.ts`
```typescript
export const API_CONFIG = {
  WS_URL: "http://8.137.125.187:3000", // WebSocket服务地址
  // 其他配置...
};
```

### 重连配置
文件：`src/services/websocket.ts`
```typescript
private maxReconnectAttempts = 5; // 最大重连次数
private reconnectDelay = 1000; // 重连延迟（毫秒）
```

## 总结

本WebSocket实时通信系统提供了完整的双向通信能力，支持私聊和群聊，具有良好的错误处理和用户体验。通过以上测试步骤，您可以验证系统的各项功能是否正常工作。 