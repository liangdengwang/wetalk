export interface ChatMessage {
  content: string;
  sender: string;
  senderName?: string;
  senderAvatar?: string;
  receiver?: string;
  groupId?: string;
  time?: string;
  isPrivate?: boolean;
  isGroup?: boolean;
}

export interface Message {
  id: number;
  sender: "me" | "other";
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  time: string;
  timestamp?: number;
  deleted?: boolean;
}

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  lastMessage?: string;
  unread?: number;
}
