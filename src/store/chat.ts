import { create } from "zustand";
import socket from "../utils/socket";

interface Message {
  id: string;
  content: string;
  sender: string;
  receiver?: string;
  groupId?: string;
  time: string;
}

interface ChatState {
  messages: Message[];
  currentChat: {
    type: "private" | "group";
    id: string;
  } | null;
  isConnected: boolean;
  addMessage: (message: Message) => void;
  setCurrentChat: (
    chat: { type: "private" | "group"; id: string } | null
  ) => void;
  setConnectionStatus: (status: boolean) => void;
  sendMessage: (content: string) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentChat: null,
  isConnected: false,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setCurrentChat: (chat) =>
    set(() => ({
      currentChat: chat,
    })),

  setConnectionStatus: (status) =>
    set(() => ({
      isConnected: status,
    })),

  sendMessage: (content) => {
    const { currentChat } = get();
    if (!currentChat) return;

    const message = {
      content,
      time: new Date().toISOString(),
      ...(currentChat.type === "private"
        ? { receiver: currentChat.id }
        : { groupId: currentChat.id }),
    };

    socket.sendMessage(message);
  },
}));

// 设置WebSocket监听器
socket.on("message", (message: Message) => {
  useChatStore.getState().addMessage(message);
});

socket.on("connection_event", (event: { status: string }) => {
  useChatStore.getState().setConnectionStatus(event.status === "connected");
});

export default useChatStore;
