# 消息API集成文档

## 概述

此文档描述了如何将后端消息API集成到前端聊天应用中，实现实时聊天功能。

## 新增文件

### 1. `src/utils/message.ts`
消息相关的API工具函数和类型定义。

**主要功能：**
- 定义消息类型和接口
- 提供所有消息相关的API调用函数
- 数据格式转换（后端 MongoDB 格式 ↔ 前端格式）

**关键接口：**
```typescript
// 消息类型
export enum MessageType {
  PRIVATE = 'private',
  GROUP = 'group', 
  ROOM = 'room',
  PUBLIC = 'public'
}

// API消息格式
export interface MessageData {
  _id: string;
  content: string;
  sender: string;
  receiver?: string;
  roomId?: string;
  groupId?: string;
  messageType: MessageType;
  createdAt: string;
  senderInfo?: {
    user_name: string;
    avatar: string;
  };
  receiverInfo?: {
    user_name: string;
    avatar: string;
  };
  groupInfo?: {
    name: string;
    avatar: string;
  };
  readStatus: boolean;
  isDeleted: boolean;
}
```

**API函数：**
- `createMessage()` - 创建新消息
- `getPrivateMessages()` - 获取私聊消息
- `getGroupMessages()` - 获取群组消息
- `getUnreadCount()` - 获取未读消息数量
- `markAsRead()` - 标记消息为已读
- `markConversationAsRead()` - 标记对话为已读
- `softDeleteMessage()` - 软删除消息
- `deleteMessage()` - 硬删除消息
- `updateMessage()` - 更新消息
- `queryMessages()` - 高级查询消息

### 2. `src/hooks/useMessages.ts`
消息状态管理Hook。

**主要功能：**
- 提供消息列表状态管理
- 封装API调用
- 提供加载状态和错误处理
- 支持消息的增删改查操作

**使用示例：**
```typescript
const {
  messages,
  loading,
  error,
  getPrivateMessages,
  createMessage,
  markAsRead
} = useMessages();
```

### 3. `src/hooks/useMessages.ts` (useUnreadCount)
未读消息数量管理Hook。

**主要功能：**
- 管理各个对话的未读消息数量
- 支持批量获取未读数量
- 提供清除未读数量功能

### 4. `src/hooks/useWebSocket.ts`
WebSocket实时通信Hook。

**主要功能：**
- 管理WebSocket连接
- 处理实时消息接收
- 发送消息和状态更新
- 处理用户在线状态和输入状态

### 5. `src/components/chat/ChatListWithAPI.tsx`
集成API的聊天列表组件。

**主要改进：**
- 显示真实的未读消息数量
- 点击对话时清除未读数量
- 支持批量加载未读数量

## 后端API对应关系

| 前端功能 | 后端接口 | 说明 |
|---------|---------|-----|
| 发送消息 | `POST /messages` | 创建新消息 |
| 加载私聊历史 | `GET /messages/private/:otherUserId` | 获取私聊消息历史 |
| 加载群组历史 | `GET /messages/group/:groupId` | 获取群组消息历史 |
| 获取未读数量 | `GET /messages/unread/count` | 获取未读消息数量 |
| 标记已读 | `PATCH /messages/:id/read` | 标记单条消息已读 |
| 标记对话已读 | `PATCH /messages/conversation/read` | 标记整个对话已读 |
| 撤回消息 | `DELETE /messages/:id/soft` | 软删除消息 |
| 删除消息 | `DELETE /messages/:id` | 硬删除消息 |
| 更新消息 | `PUT /messages/:id` | 更新消息状态 |
| 查询消息 | `GET /messages` | 高级查询接口 |

## 数据格式转换

### 后端 → 前端
```typescript
const convertAPIMessageToUIMessage = (apiMessage: APIMessage): ChatMessage => {
  return {
    id: parseInt(apiMessage.id) || Date.now(),
    sender: apiMessage.sender === currentUserId ? "me" : "other",
    senderId: apiMessage.sender,
    senderName: apiMessage.senderInfo?.username || "用户",
    senderAvatar: apiMessage.senderInfo?.avatar || "",
    content: apiMessage.content,
    time: new Date(apiMessage.createdAt).toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    timestamp: apiMessage.timestamp,
    deleted: apiMessage.isDeleted
  };
};
```

### 前端 → 后端
```typescript
const messageData: CreateMessageDto = {
  content: content.trim(),
  messageType: isGroup ? MessageType.GROUP : MessageType.PRIVATE,
  ...(isGroup ? { groupId: chatId } : { receiver: chatId })
};
```

## ChatArea.tsx 主要更新

### 1. 集成消息API
```typescript
// 使用消息API hooks
const {
  messages: apiMessages,
  loading,
  error,
  getPrivateMessages,
  getGroupMessages,
  createMessage,
  softDeleteMessage,
  markConversationAsRead,
  clearMessages,
  clearError
} = useMessages();
```

### 2. 加载消息历史
```typescript
useEffect(() => {
  if (!chatId || !userId) return;

  const loadMessages = async () => {
    try {
      clearError();
      clearMessages();
      
      if (isGroup) {
        await getGroupMessages(chatId);
      } else {
        await getPrivateMessages(chatId);
      }
    } catch (err) {
      console.error('加载消息失败:', err);
    }
  };

  loadMessages();
}, [chatId, userId, isGroup]);
```

### 3. 发送消息
```typescript
const handleSendMessage = useCallback(async (content: string) => {
  if (!chatId || !userId || !content.trim()) return;

  const messageData: CreateMessageDto = {
    content: content.trim(),
    messageType: isGroup ? MessageType.GROUP : MessageType.PRIVATE,
    ...(isGroup ? { groupId: chatId } : { receiver: chatId })
  };

  try {
    const newMessage = await createMessage(messageData);
    if (newMessage) {
      // 同时添加到本地store（为了保持兼容性）
      const uiMessage = convertAPIMessageToUIMessage(newMessage);
      addMessage(chatId, uiMessage);
      
      // 通过WebSocket发送消息（如果连接存在）
      if (socket) {
        socket.emit('sendMessage', newMessage);
      }
    }
  } catch (err) {
    console.error('发送消息失败:', err);
  }
}, [chatId, userId, isGroup, createMessage, addMessage, socket]);
```

### 4. 标记已读
```typescript
useEffect(() => {
  if (chatId && userId) {
    // 标记本地聊天为已读
    markAsRead(chatId);
    
    // 标记服务器端对话为已读
    if (isGroup) {
      markConversationAsRead(undefined, chatId);
    } else {
      markConversationAsRead(chatId, undefined);
    }
  }
}, [chatId, userId, isGroup, markAsRead, markConversationAsRead]);
```

## WebSocket集成

### 连接设置
```typescript
const { socket, isConnected, sendMessage } = useWebSocket({
  onMessageReceived: (message) => {
    // 处理接收到的新消息
    addMessage(message);
  },
  onUserStatusChanged: (userId, status) => {
    // 处理用户状态变化
  }
});
```

### 环境变量
在 `.env` 文件中配置：
```
VITE_WS_URL=ws://localhost:3001
```

## 错误处理

### 1. API错误
```typescript
// 错误提示
{error && (
  <div className="px-4 py-2 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
    {error}
    <button 
      onClick={clearError}
      className="ml-2 text-red-600 hover:text-red-800 font-medium"
    >
      关闭
    </button>
  </div>
)}
```

### 2. 加载状态
```typescript
// 加载状态
{loading && (
  <div className="px-4 py-2 bg-blue-100 border-l-4 border-blue-500 text-blue-700 text-sm">
    正在加载消息...
  </div>
)}
```

### 3. 连接状态指示器
```typescript
// 连接状态指示器
{!socket || !socket.connected ? (
  <div className="px-4 py-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 text-sm">
    ⚠️ 网络连接不稳定，消息可能延迟发送
  </div>
) : null}
```

### 4. 离线模式支持
- 即使API调用失败，用户仍能看到历史聊天记录
- 发送消息时立即显示，提升用户体验
- 网络恢复后自动同步
- 对话标记已读失败时不影响UI显示

### 5. 500错误修复
如果遇到"Cast to ObjectId failed"错误，这通常是后端路由配置问题：
- 确保后端路由正确配置 `/messages/conversation/read`
- 检查是否有路由冲突
- 确保参数正确传递

## 使用说明

### 1. 替换组件
将原来的 `ChatList` 组件替换为 `ChatListWithAPI`：

```typescript
// 在主聊天页面中
import ChatListWithAPI from '../components/chat/ChatListWithAPI';

// 使用新组件
<ChatListWithAPI className="w-80" />
```

### 2. 更新ChatArea
使用新的 `ChatArea` 组件，它已经集成了所有API功能。

### 3. WebSocket连接
在应用的根组件中初始化WebSocket连接：

```typescript
const App = () => {
  const { isConnected } = useWebSocket({
    onMessageReceived: (message) => {
      // 全局处理新消息
    }
  });

  return (
    <div className="app">
      {/* 应用内容 */}
    </div>
  );
};
```

## 测试

### 1. API测试
确保后端API服务运行在正确的端口并返回预期的数据格式。

### 2. WebSocket测试
验证WebSocket连接能够正常建立，并且能够收发消息。

### 3. 前端功能测试
- 发送消息
- 接收消息
- 查看消息历史
- 未读消息数量显示
- 标记已读功能
- 消息删除和撤回

## 注意事项

1. **数据格式兼容性**：确保前后端数据格式一致，特别注意MongoDB的`_id`字段和`user_name`字段。

2. **错误处理**：所有API调用都应该有适当的错误处理。

3. **性能优化**：对于大量消息，考虑分页加载和虚拟滚动。

4. **实时性**：WebSocket连接断开时应该有重连机制。

5. **安全性**：确保所有API调用都包含正确的认证令牌。

## 后续优化

1. **消息缓存**：实现本地消息缓存以减少API调用。

2. **离线支持**：添加离线消息存储和同步。

3. **文件上传**：集成文件消息支持。

4. **消息搜索**：实现消息搜索功能。

5. **推送通知**：添加浏览器推送通知支持。 