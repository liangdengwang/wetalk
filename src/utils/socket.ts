import { io, Socket } from "socket.io-client";
import { API_CONFIG } from "./config";

interface ChatMessage {
  content: string;
  sender?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  receiver?: string;
  groupId?: string;
  time: string;
}

// 定义事件数据类型
interface ConnectionEventData {
  status: "connected" | "disconnected" | "error";
  error?: Error;
  reason?: string;
}

interface FriendRequestData {
  id: string;
  sender: string;
  receiver: string;
  status: string;
  createdAt: string;
}

interface FriendStatusData {
  friendId: string;
  status: "online" | "offline";
}

interface GroupMemberChangeData {
  groupId: string;
  userId: string;
  action: "join" | "leave";
  timestamp: string;
}

// 定义事件处理器类型
type EventHandler<T> = (data: T) => void;

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: Socket | null = null;
  private messageHandlers: Map<string, EventHandler<unknown>[]> = new Map();
  private connectionAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(token: string) {
    if (this.socket?.connected) {
      console.log("WebSocket已经连接，跳过连接");
      return;
    }

    console.log("开始建立WebSocket连接...");
    console.log("连接URL:", API_CONFIG.WS_URL);

    this.socket = io(API_CONFIG.WS_URL, {
      query: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 5000, // 连接超时时间
      transports: ["websocket", "polling"], // 优先使用 WebSocket
      forceNew: true, // 强制创建新连接
      autoConnect: true, // 自动连接
      withCredentials: true, // 允许跨域携带 cookie
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) {
      console.error("无法设置监听器：socket未初始化");
      return;
    }

    this.socket.on("connect", () => {
      console.log("WebSocket连接成功，Socket ID:", this.socket?.id);
      this.connectionAttempts = 0;
      this.emit("connection_event", {
        status: "connected",
      } as ConnectionEventData);
    });

    this.socket.on("connect_error", (error: Error) => {
      this.connectionAttempts++;
      console.error(
        `WebSocket连接错误 (尝试 ${this.connectionAttempts}/${this.maxReconnectAttempts}):`,
        error
      );
      this.emit("connection_event", {
        status: "error",
        error,
      } as ConnectionEventData);
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("WebSocket断开连接，原因:", reason);
      this.emit("connection_event", {
        status: "disconnected",
        reason,
      } as ConnectionEventData);
    });

    this.socket.on("receive_message", (message: ChatMessage) => {
      console.log("收到新消息:", message);
      this.emit("message", message);
    });

    this.socket.on("friend_request", (request: FriendRequestData) => {
      console.log("收到好友请求:", request);
      this.emit("friend_request", request);
    });

    this.socket.on("friend_request_update", (request: FriendRequestData) => {
      console.log("收到好友请求更新:", request);
      this.emit("friend_request_update", request);
    });

    this.socket.on("friend_status", (data: FriendStatusData) => {
      console.log("收到好友状态更新:", data);
      this.emit("friend_status", data);
    });

    this.socket.on("group_member_change", (data: GroupMemberChangeData) => {
      console.log("收到群组成员变更:", data);
      this.emit("group_member_change", data);
    });

    // 添加重连事件监听
    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log(`WebSocket重连成功，尝试次数: ${attemptNumber}`);
    });

    this.socket.on("reconnect_attempt", (attemptNumber: number) => {
      console.log(
        `正在尝试重连 (${attemptNumber}/${this.maxReconnectAttempts})...`
      );
    });

    this.socket.on("reconnect_error", (error: Error) => {
      console.error("重连失败:", error);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("重连失败，已达到最大重试次数");
    });

    // 添加连接成功事件监听
    this.socket.on(
      "connection_success",
      (data: { message: string; userId: string; username: string }) => {
        console.log("收到连接成功消息:", data);
      }
    );
  }

  public sendMessage(message: ChatMessage) {
    if (!this.socket?.connected) {
      console.error("WebSocket未连接，无法发送消息");
      return;
    }
    console.log("发送消息:", message);
    this.socket.emit("send_message", message);
  }

  public on<T>(event: string, handler: EventHandler<T>) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, []);
    }
    this.messageHandlers.get(event)?.push(handler as EventHandler<unknown>);
  }

  public off<T>(event: string, handler: EventHandler<T>) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler as EventHandler<unknown>);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // 将private改为public
  public emit<T>(event: string, data: T) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  public disconnect() {
    if (this.socket) {
      console.log("主动断开WebSocket连接");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket() {
    if (!this.socket) {
      console.warn("获取socket时发现socket未初始化");
    } else if (!this.socket.connected) {
      console.warn("获取socket时发现socket未连接");
    }
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default WebSocketManager.getInstance();
