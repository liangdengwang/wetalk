import { create } from "zustand";
import { persist } from "zustand/middleware";

// 消息接口
export interface Message {
  id: number;
  sender: "me" | "other";
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content: string;
  time: string;
  timestamp?: number; // 添加时间戳，用于撤回功能
  deleted?: boolean; // 标记消息是否被删除
}

// 聊天项接口
export interface ChatItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  isGroup: boolean;
}

// 聊天状态管理接口
interface ChatStore {
  // 聊天列表
  chatList: ChatItem[];

  // 消息数据，key 是聊天 ID
  messages: Record<string, Message[]>;

  // 添加新消息
  addMessage: (chatId: string, message: Message) => void;

  // 标记聊天为已读
  markAsRead: (chatId: string) => void;

  // 获取聊天的消息
  getMessages: (chatId: string) => Message[];

  // 获取聊天项
  getChatItem: (chatId: string, isGroup: boolean) => ChatItem | undefined;

  // 更新聊天列表中的最后一条消息
  updateLastMessage: (chatId: string, content: string) => void;

  // 删除消息（仅在视图中标记为删除）
  deleteMessage: (chatId: string, messageId: number) => void;

  // 撤回消息（仅限2分钟内的自己发送的消息）
  recallMessage: (chatId: string, messageId: number) => boolean;

  // 添加或更新聊天项
  addOrUpdateChatItem: (item: {
    id: string;
    name: string;
    avatar: string;
    isGroup: boolean;
    memberCount?: number;
  }) => void;
}

// 初始聊天列表数据
const initialChatList: ChatItem[] = [];

// 初始消息数据
const initialMessages: Record<string, Message[]> = {};

// 创建聊天状态管理
const useChatStore = create(
  persist<ChatStore>(
    (set, get) => ({
      chatList: initialChatList,
      messages: initialMessages,

      // 添加新消息
      addMessage: (chatId, message) => {
        const { messages, chatList } = get();

        // 添加时间戳
        const messageWithTimestamp = {
          ...message,
          timestamp: Date.now(),
        };

        // 更新消息列表
        const chatMessages = messages[chatId] || [];
        const updatedMessages = {
          ...messages,
          [chatId]: [...chatMessages, messageWithTimestamp],
        };

        // 更新聊天列表中的最后一条消息
        const updatedChatList = chatList.map((chat) => {
          if (chat.id === chatId) {
            // 如果是群聊且发送者不是自己，添加发送者名称前缀
            let lastMessage = message.content;
            if (
              chat.isGroup &&
              message.sender === "other" &&
              message.senderName
            ) {
              lastMessage = `${message.senderName}: ${message.content}`;
            }

            // 如果不是当前打开的聊天，增加未读数
            const unread = chat.unread + (message.sender === "other" ? 1 : 0);

            return {
              ...chat,
              lastMessage,
              time: message.time,
              unread,
            };
          }
          return chat;
        });

        set({
          messages: updatedMessages,
          chatList: updatedChatList,
        });
      },

      // 标记聊天为已读
      markAsRead: (chatId) => {
        const { chatList } = get();
        const updatedChatList = chatList.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              unread: 0,
            };
          }
          return chat;
        });

        set({
          chatList: updatedChatList,
        });
      },

      // 获取聊天的消息
      getMessages: (chatId) => {
        const { messages } = get();
        return messages[chatId] || [];
      },

      // 获取聊天项
      getChatItem: (chatId, isGroup) => {
        const { chatList } = get();
        return chatList.find(
          (chat) => chat.id === chatId && chat.isGroup === isGroup
        );
      },

      // 更新聊天列表中的最后一条消息
      updateLastMessage: (chatId, content) => {
        const { chatList } = get();
        const updatedChatList = chatList.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              lastMessage: content,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          }
          return chat;
        });

        set({
          chatList: updatedChatList,
        });
      },

      // 删除消息（仅在视图中标记为删除）
      deleteMessage: (chatId, messageId) => {
        const { messages, chatList } = get();
        const chatMessages = messages[chatId] || [];

        // 标记消息为已删除
        const updatedChatMessages = chatMessages.map((msg) => {
          if (msg.id === messageId) {
            return { ...msg, deleted: true };
          }
          return msg;
        });

        // 更新消息列表
        const updatedMessages = {
          ...messages,
          [chatId]: updatedChatMessages,
        };

        // 如果删除的是最后一条消息，更新聊天列表中的最后一条消息
        const lastMessage = updatedChatMessages
          .filter((msg) => !msg.deleted)
          .pop();
        let updatedChatList = chatList;

        if (lastMessage) {
          updatedChatList = chatList.map((chat) => {
            if (chat.id === chatId) {
              // 如果是群聊且发送者不是自己，添加发送者名称前缀
              let content = lastMessage.content;
              if (
                chat.isGroup &&
                lastMessage.sender === "other" &&
                lastMessage.senderName
              ) {
                content = `${lastMessage.senderName}: ${content}`;
              }

              return {
                ...chat,
                lastMessage: content,
                time: lastMessage.time,
              };
            }
            return chat;
          });
        }

        set({
          messages: updatedMessages,
          chatList: updatedChatList,
        });
      },

      // 撤回消息（仅限2分钟内的自己发送的消息）
      recallMessage: (chatId, messageId) => {
        const { messages, chatList } = get();
        const chatMessages = messages[chatId] || [];

        // 查找消息
        const message = chatMessages.find((msg) => msg.id === messageId);

        // 检查是否可以撤回
        if (!message || message.sender !== "me" || message.deleted) {
          return false;
        }

        // 检查时间是否在2分钟内
        const now = Date.now();
        const messageTime = message.timestamp || 0;
        const twoMinutesInMs = 2 * 60 * 1000;

        if (now - messageTime > twoMinutesInMs) {
          return false;
        }

        // 标记消息为已删除
        const updatedChatMessages = chatMessages.map((msg) => {
          if (msg.id === messageId) {
            return { ...msg, deleted: true, content: "此消息已撤回" };
          }
          return msg;
        });

        // 更新消息列表
        const updatedMessages = {
          ...messages,
          [chatId]: updatedChatMessages,
        };

        // 如果撤回的是最后一条消息，更新聊天列表中的最后一条消息
        const lastVisibleMessage = chatMessages
          .filter((msg) => msg.id !== messageId && !msg.deleted)
          .pop();

        let updatedChatList = chatList;

        if (lastVisibleMessage) {
          updatedChatList = chatList.map((chat) => {
            if (chat.id === chatId) {
              // 如果是群聊且发送者不是自己，添加发送者名称前缀
              let content = lastVisibleMessage.content;
              if (
                chat.isGroup &&
                lastVisibleMessage.sender === "other" &&
                lastVisibleMessage.senderName
              ) {
                content = `${lastVisibleMessage.senderName}: ${content}`;
              }

              return {
                ...chat,
                lastMessage: content,
                time: lastVisibleMessage.time,
              };
            }
            return chat;
          });
        } else {
          // 如果没有其他可见消息，更新为"无消息"
          updatedChatList = chatList.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                lastMessage: "无消息",
              };
            }
            return chat;
          });
        }

        set({
          messages: updatedMessages,
          chatList: updatedChatList,
        });

        return true;
      },

      // 添加或更新聊天项
      addOrUpdateChatItem: (item) => {
        const { chatList, messages } = get();

        // 检查聊天项是否已存在
        const existingChatIndex = chatList.findIndex(
          (chat) => chat.id === item.id && chat.isGroup === item.isGroup
        );

        if (existingChatIndex !== -1) {
          // 如果已存在，则更新
          const updatedChatList = [...chatList];
          updatedChatList[existingChatIndex] = {
            ...updatedChatList[existingChatIndex],
            name: item.name,
            avatar: item.avatar,
          };

          set({ chatList: updatedChatList });
          return;
        }

        // 如果不存在，则添加
        const newChatItem: ChatItem = {
          id: item.id,
          name: item.name,
          avatar: item.avatar,
          isGroup: item.isGroup,
          lastMessage: "无新消息",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: 0,
        };

        // 确保消息数组存在
        if (!messages[item.id]) {
          const updatedMessages = {
            ...messages,
            [item.id]: [],
          };

          set({
            chatList: [newChatItem, ...chatList],
            messages: updatedMessages,
          });
        } else {
          set({
            chatList: [newChatItem, ...chatList],
          });
        }
      },
    }),
    {
      name: "chat-store",
    }
  )
);

export default useChatStore;
