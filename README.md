# WeTalk - 为现代沟通而生

WeTalk 是一款功能丰富、体验流畅的实时聊天应用，旨在提供一个高效、可靠且美观的沟通平台。无论是私下密语、好友分享，还是团队协作，WeTalk 都能满足您的需求。

## ✨ 产品设计

WeTalk 的核心设计理念是 **简洁、高效、实时**。我们相信，沟通工具本身不应成为沟通的障碍。因此，我们打造了一个界面清爽、交互自然的用户界面，并确保消息传递的即时性，让每一次对话都如行云流水般顺畅。

### 核心功能

*   **用户系统**: 支持用户注册、登录和个人资料管理。
*   **好友关系**: 用户可以搜索、添加和管理好友，构建自己的社交网络。
*   **实时单聊**: 与好友进行一对一的实时文字、表情聊天。
*   **群组聊天**: 创建和加入群组，满足多人协作和讨论的需求。
*   **消息管理**: 实时接收和发送消息，保证沟通的即时性。

## 🚀 技术架构

WeTalk 采用业界前沿的 **前后端分离** 架构，确保了项目的高内聚、低耦合，同时也为未来的功能扩展和维护提供了极大的便利。

![Architecture Diagram](https://your-image-url-here.com/architecture.png)
*(这是一个占位符，您可以后续替换为真实的架构图)*

### 
| **分类** | **技术栈** | **说明** |
| :--- | :--- | :--- |
| **后端** | [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/), [MongoDB](https://www.mongodb.com/), [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) | 基于 Node.js 的企业级框架，提供强大的模块化和可伸缩性。 |
| **前端** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Zustand](https://github.com/pmndrs/zustand) | 现代、高效的 UI 开发框架，提供卓越的开发体验和运行时性能。 |
| **代码质量** | ESLint, Prettier | 统一的代码风格和规范，保证了代码的一致性和可读性。 |

### 后端深度解析 (Server)

后端服务基于 **NestJS** 构建，充分利用了其面向切面编程（AOP）和依赖注入（DI）的特性，构建了一个结构清晰、易于扩展的模块化应用。

*   **模块化设计**: 核心功能如 `User`, `Auth`, `Message`, `Group`, `Friend` 都被拆分为独立的模块，每个模块权责分明。
*   **数据库**: 选用 **MongoDB** 作为主数据库，通过 `Mongoose` 库进行对象数据建模（ODM）。MongoDB 的文档模型非常适合存储聊天记录和用户配置等半结构化数据。
*   **实时通信**: 通过 **NestJS Gateway** (`socket.io` 的封装) 实现了 WebSocket 服务，为客户端提供了低延迟的消息推送和实时事件通知。
*   **认证机制**: `AuthModule` 暗示了项目使用了安全的认证方式（很可能是 JWT - JSON Web Tokens），保护用户账户和 API 接口安全。
*   **统一异常处理**: 通过自定义 `HttpExceptionFilter`，实现了全局的错误捕获和标准化响应，提升了 API 的健壮性。

#### 数据库模型设计示例 (Mongoose Schema)

为了保证数据的结构化和一致性，我们为核心业务对象设计了清晰的 Schema。以"消息"模型为例，其结构定义如下：

```typescript
// server/src/server/message/message.dto/message.schema.ts
import { Schema } from 'mongoose';

export const messageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String },
  roomId: { type: String },
  messageType: {
    type: String,
    required: true,
    enum: ['private', 'room'],
  },
  createdAt: { type: Date, default: Date.now },
  senderInfo: { /* ... */ },
  receiverInfo: { /* ... */ },
  groupInfo: { /* ... */ },
  readStatus: { type: Boolean, default: false },
});

// 创建复合索引以优化查询性能
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ roomId: 1 });
```
这个 Schema 不仅定义了消息的基本字段和类型，还通过 `enum` 进行了消息类型约束，并且为常用查询字段（如 `sender`, `receiver`, `roomId`）建立了索引，这是数据库性能优化的关键实践。

### 前端深度解析 (Client)

前端应用是一个使用 **Vite** + **React 19** 构建的现代化单页应用（SPA），注重开发效率和用户体验。

*   **闪电般的开发体验**: **Vite** 提供了基于原生 ES-Module 的开发服务器，实现了毫秒级的热模块重载（HMR），极大地提升了开发效率。
*   **现代 React**: 使用 **React 19**，可以利用其最新的特性，如并发渲染（Concurrent Rendering），带来更流畅的用户体验。
*   **轻量级状态管理**: 采用 **Zustand** 进行全局状态管理。其简洁的 API 和基于 Hooks 的设计范式，让状态逻辑清晰易懂，同时避免了 Redux 等库的模板代码。`zustand-persist` 中间件用于将用户会话等关键状态持久化到本地存储。
*   **原子化 CSS 与组件库**: **Tailwind CSS** 的使用使得构建高度定制化的 UI 变得简单高效。结合 **daisyUI**，在不失灵活性的前提下，快速搭建出美观的组件。
*   **流畅动画**: 集成 **Framer Motion** (`motion`)，为 UI 元素添加平滑、有意义的过渡动画，显著提升了产品的交互质感。
*   **类型安全**: 前后端均使用 **TypeScript**，保证了数据的类型安全，减少了运行时错误，使得大型项目协作更为可靠。

#### 组件化与结构设计

前端代码结构清晰，通过高度抽象的组件和合理的目录划分，实现了高效的代码复用和可维护性。

*   **布局组件 (`Layout.tsx`)**: 应用的核心布局被抽象为 `Layout` 组件，它负责整合侧边栏（联系人、设置）和主聊天窗口，是单页应用结构的基础。
*   **通用组件 (`components/common/`)**: 项目中大量可复用的 UI 元素，如 `Button`, `Input`, `Avatar` 等，都被抽离到 `common` 目录中。这种实践避免了代码冗余，并保证了应用内 UI 的一致性。
*   **业务组件 (`components/chat/`, `components/contact/`)**: 与特定业务逻辑紧密耦合的组件（如聊天气泡、联系人列表项）被组织在各自的目录中，使得项目结构一目了然。

以主题切换组件为例，它展示了状态管理 (`Zustand`) 与 UI 组件的优雅结合：

```tsx
// client/src/components/ThemeSwitcher.tsx

import { useThemeStore } from "@/store/theme"; // 1. 引入 Zustand Store
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  // 2. 从 Store 中获取当前主题和切换方法
  const { theme, toggleTheme } = useThemeStore();

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        className="theme-controller"
        value="synthwave"
        checked={theme === "dark"}
        onChange={toggleTheme} // 3. 绑定事件，调用 Store 的 action
      />
      <Sun className="swap-on fill-current w-6 h-6" />
      <Moon className="swap-off fill-current w-6 h-6" />
    </label>
  );
};

export default ThemeSwitcher;
```
这个小组件自身逻辑内聚，通过 `useThemeStore` 这个 Hook 与全局状态连接，职责单一，可被轻松放置在应用任何需要的地方，是组件化思想的完美体现。

## 🌟 项目优点

*   **技术栈先进**: 选用了 React/NestJS/Vite 等社区热门且强大的技术，项目具有很高的技术价值。
*   **高内聚低耦合**: 清晰的模块化设计，使得功能易于维护和扩展。
*   **开发体验优秀**: Vite 和 NestJS CLI 提供了顶级的开发工具链，提升开发效率。
*   **代码质量可控**: 集成了完整的 Linting 和 Formatting 工具链。
*   **实时体验**: 基于 WebSocket 的架构为用户提供了流畅的实时沟通体验。

## 🚀 快速开始

### 环境要求

*   [Node.js](https://nodejs.org/) (>= 18.x)
*   [pnpm](https://pnpm.io/)
*   [MongoDB](https://www.mongodb.com/try/download/community)

### 后端启动

```bash
# 进入 server 目录
cd server

# 安装依赖
pnpm install

# 启动开发服务
pnpm run start:dev
```

### 前端启动

```bash
# 进入 client 目录
cd client

# 安装依赖
pnpm install

# 启动开发服务
pnpm run dev
```

现在，您可以在浏览器中打开 `http://localhost:5173` (或其他 Vite 指定的端口) 来访问 WeTalk 应用。

---

希望这份文档能帮助您更好地理解和展示 WeTalk 项目！
