# 修复好友请求ID为undefined的问题

## 🐛 问题描述

在 `FriendRequestsModal.tsx` 中，当点击"接受"或"拒绝"好友请求时，`requestId` 为 `undefined`，导致向后端发送请求失败。

## 🔍 问题原因

后端返回的好友请求数据使用 MongoDB 的标准格式：
- ID字段为 `_id` 而不是 `id`
- 用户信息中的用户名字段为 `user_name` 而不是 `username`
- 嵌套对象中的ID也是 `_id` 格式

但前端接口定义和使用的是标准化的格式（`id`, `username`），造成了数据格式不匹配。

## ✅ 修复方案

### 1. 添加后端数据格式接口定义

```typescript
// 后端返回的好友请求数据格式
export interface FriendRequestData {
  _id: string;
  senderId: string;
  receiverId: string;
  message?: string;
  status: FriendRequestStatus;
  createdAt: string;
  updatedAt: string;
  sender?: {
    _id: string;
    user_name: string;
    avatar?: string;
  };
  receiver?: {
    _id: string;
    user_name: string;
    avatar?: string;
  };
}

// 后端返回的好友数据格式
export interface FriendData {
  _id: string;
  user_name: string;
  avatar?: string;
  status?: string;
  lastOnline?: string;
}
```

### 2. 添加数据转换函数

```typescript
// 将后端好友请求数据转换为前端格式
const convertFriendRequestData = (data: FriendRequestData): FriendRequest => {
  return {
    id: data._id,
    senderId: data.senderId,
    receiverId: data.receiverId,
    message: data.message,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    sender: data.sender ? {
      id: data.sender._id,
      username: data.sender.user_name,
      avatar: data.sender.avatar
    } : undefined,
    receiver: data.receiver ? {
      id: data.receiver._id,
      username: data.receiver.user_name,
      avatar: data.receiver.avatar
    } : undefined
  };
};

// 将后端好友数据转换为前端格式
const convertFriendData = (data: FriendData): Friend => {
  return {
    id: data._id,
    username: data.user_name,
    avatar: data.avatar,
    status: data.status,
    lastOnline: data.lastOnline
  };
};
```

### 3. 更新API函数使用数据转换

所有相关API函数都已更新为在返回数据前进行格式转换：

- `getReceivedRequests()` - 转换收到的好友请求
- `getSentRequests()` - 转换发送的好友请求
- `createFriendRequest()` - 转换创建的好友请求
- `updateFriendRequest()` - 转换更新的好友请求
- `getFriendsList()` - 转换好友列表

### 4. 添加调试信息

在 `FriendRequestsModal.tsx` 中添加了 console.log 来帮助调试数据格式。

## 🧪 测试验证

修复后，你可以：

1. 打开好友请求弹窗
2. 查看浏览器控制台中的日志，确认数据格式正确
3. 点击"接受"或"拒绝"按钮，应该能正常发送请求

## 📝 修改的文件

- `src/utils/friend.ts` - 添加数据格式定义和转换函数
- `src/components/contact/FriendRequestsModal.tsx` - 添加调试日志

现在好友请求的ID应该正确传递，不再是 `undefined`。 