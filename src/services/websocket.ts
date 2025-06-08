import { io, Socket } from 'socket.io-client';
import { 
  ChatMessage, 
  WebSocketEvents, 
  MessageReceived, 
  MessageSent,
  UserStatus,
  FriendRequest,
  FriendStatus,
  GroupMemberChange,
  GroupReloadData,
  ErrorMessage,
  ConnectionSuccess
} from '../types/websocket';
import { API_CONFIG } from '../utils/config';

export type WebSocketEventHandler<T = unknown> = (data: T) => void;

export class WebSocketManager {
  private socket: Socket | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();

  constructor() {
    this.setupEventHandlers();
  }

  /**
   * 连接到WebSocket服务器
   */
  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.token = token;
      this.socket = io(API_CONFIG.WS_URL, {
        query: { token },
        transports: ['websocket'],
        timeout: 10000,
      });

      // 连接成功
      this.socket.on('connect', () => {
        console.log('WebSocket连接成功');
        this.reconnectAttempts = 0;
        resolve();
      });

      // 连接错误
      this.socket.on('connect_error', (error) => {
        console.error('WebSocket连接错误:', error);
        reject(error);
      });

      // 设置事件监听器
      this.setupSocketListeners();
    });
  }

  /**
   * 断开WebSocket连接
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.token = null;
    }
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * 发送消息
   */
  sendMessage(message: Omit<ChatMessage, 'time'>): void {
    if (!this.socket?.connected) {
      console.error('WebSocket未连接，无法发送消息');
      return;
    }

    const messageWithTime: ChatMessage = {
      ...message,
      time: new Date().toISOString(),
    };

    this.socket.emit('send_message', messageWithTime);
  }

  /**
   * 重新加载群组
   */
  reloadGroups(): void {
    if (!this.socket?.connected) {
      console.error('WebSocket未连接，无法重新加载群组');
      return;
    }

    this.socket.emit('reload_groups');
  }

  /**
   * 注册事件监听器
   */
  on<K extends keyof WebSocketEvents>(
    event: K,
    handler: WebSocketEventHandler<WebSocketEvents[K]>
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler as WebSocketEventHandler);
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof WebSocketEvents>(
    event: K,
    handler: WebSocketEventHandler<WebSocketEvents[K]>
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler as WebSocketEventHandler);
    }
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners(): void {
    this.eventHandlers.clear();
  }

  /**
   * 触发事件处理器
   */
  private emit<K extends keyof WebSocketEvents>(
    event: K,
    data: WebSocketEvents[K]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`事件处理器错误 [${event}]:`, error);
        }
      });
    }
  }

  /**
   * 设置Socket事件监听器
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    // 连接成功
    this.socket.on('connection_success', (data: ConnectionSuccess) => {
      console.log('连接成功通知:', data);
      this.emit('connection_success', data);
    });

    // 接收消息
    this.socket.on('receive_message', (data: MessageReceived) => {
      console.log('收到消息:', data);
      this.emit('receive_message', data);
    });

    // 消息发送确认
    this.socket.on('message_sent', (data: MessageSent) => {
      console.log('消息发送确认:', data);
      this.emit('message_sent', data);
    });

    // 用户状态变化
    this.socket.on('user_status', (data: UserStatus) => {
      console.log('用户状态变化:', data);
      this.emit('user_status', data);
    });

    // 好友请求
    this.socket.on('friend_request', (data: FriendRequest) => {
      console.log('收到好友请求:', data);
      this.emit('friend_request', data);
    });

    // 好友请求更新
    this.socket.on('friend_request_update', (data: FriendRequest) => {
      console.log('好友请求更新:', data);
      this.emit('friend_request_update', data);
    });

    // 好友状态变化
    this.socket.on('friend_status', (data: FriendStatus) => {
      console.log('好友状态变化:', data);
      this.emit('friend_status', data);
    });

    // 群组成员变化
    this.socket.on('group_member_change', (data: GroupMemberChange) => {
      console.log('群组成员变化:', data);
      this.emit('group_member_change', data);
    });

    // 群组重新加载
    this.socket.on('groups_reloaded', (data: GroupReloadData) => {
      console.log('群组重新加载:', data);
      this.emit('groups_reloaded', data);
    });

    // 错误处理
    this.socket.on('error', (data: ErrorMessage) => {
      console.error('WebSocket错误:', data);
      this.emit('error', data);
    });

    // 断开连接
    this.socket.on('disconnect', (reason: string) => {
      console.log('WebSocket断开连接:', reason);
      this.handleReconnect();
    });
  }

  /**
   * 处理重连逻辑
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.token) {
        this.connect(this.token).catch(error => {
          console.error('重连失败:', error);
        });
      }
    }, delay);
  }

  /**
   * 设置初始事件处理器
   */
  private setupEventHandlers(): void {
    // 这里可以设置一些默认的事件处理器
    // 比如错误处理、连接状态监控等
  }
}

// 创建单例实例
export const webSocketManager = new WebSocketManager(); 