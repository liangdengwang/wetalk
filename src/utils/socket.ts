import { io, Socket } from "socket.io-client";

interface ChatMessage {
  content: string;
  sender?: string;
  receiver?: string;
  groupId?: string;
  time: string;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: Socket | null = null;
  private messageHandlers: Map<string, Function[]> = new Map();

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io("http://localhost:3000", {
      query: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("WebSocket连接成功");
      this.emit("connection_event", { status: "connected" });
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket断开连接");
      this.emit("connection_event", { status: "disconnected" });
    });

    this.socket.on("message", (message: ChatMessage) => {
      this.emit("message", message);
    });

    this.socket.on("friend_request", (request) => {
      this.emit("friend_request", request);
    });

    this.socket.on("friend_request_update", (request) => {
      this.emit("friend_request_update", request);
    });

    this.socket.on("friend_status", (data) => {
      this.emit("friend_status", data);
    });

    this.socket.on("group_member_change", (data) => {
      this.emit("group_member_change", data);
    });
  }

  public sendMessage(message: ChatMessage) {
    if (!this.socket?.connected) {
      console.error("WebSocket未连接");
      return;
    }
    this.socket.emit("message", message);
  }

  public on(event: string, handler: Function) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, []);
    }
    this.messageHandlers.get(event)?.push(handler);
  }

  public off(event: string, handler: Function) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const handlers = this.messageHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default WebSocketManager.getInstance();
