// WebSocket 相关类型定义
// 与后端 gateway/event.gateway.ts 保持一致

export interface JwtPayload {
  username: string;
  sub: string;
}

export interface ChatMessage {
  content: string;
  sender: string;
  receiver?: string;
  groupId?: string;
  time: string;
}

export interface FriendRequest {
  _id: string;
  sender: string;
  receiver: string;
  status: string;
  senderInfo?: {
    username: string;
    avatar?: string;
    [key: string]: unknown;
  };
}

export interface UserStatus {
  userid?: string;
  username: string;
  status: 'online' | 'offline';
}

export interface FriendStatus {
  friendId: string;
  status: 'online' | 'offline';
}

export interface ConnectionSuccess {
  message: string;
  username: string;
}

export interface MessageReceived {
  content: string;
  sender: string;
  time: string;
  receiver?: string;
  groupId?: string;
  isPrivate?: boolean;
  isGroup?: boolean;
}

export interface MessageSent {
  content: string;
  sender: string;
  time: string;
  receiver?: string;
  groupId?: string;
  isPrivate?: boolean;
  isGroup?: boolean;
}

export interface GroupMemberChange {
  groupId: string;
  userId: string;
  action: 'join' | 'leave' | 'remove';
  memberInfo?: {
    username: string;
    avatar?: string;
    [key: string]: unknown;
  };
}

export interface GroupReloadData {
  count: number;
  groups: Array<{
    id: string;
    name: string;
  }>;
}

export interface ErrorMessage {
  message: string;
}

// WebSocket 事件类型映射
export interface WebSocketEvents {
  // 客户端发送事件
  send_message: ChatMessage;
  reload_groups: void;
  
  // 服务器发送事件
  connection_success: ConnectionSuccess;
  receive_message: MessageReceived;
  message_sent: MessageSent;
  user_status: UserStatus;
  friend_request: FriendRequest;
  friend_request_update: FriendRequest;
  friend_status: FriendStatus;
  group_member_change: GroupMemberChange;
  groups_reloaded: GroupReloadData;
  error: ErrorMessage;
} 