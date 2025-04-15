import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";
import { STORAGE_CONFIG } from "../utils/config";

interface CountStore {
  count: number;
  inc: () => void;
}

interface UserStore {
  isLoggedIn: boolean;
  userInfo: {
    userId: string;
    username: string;
    token: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 主题类型
type ThemeMode = "light" | "dark" | "system";

// 主题状态管理接口
interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const useCountStore = create<CountStore>((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      isLoggedIn: false,
      userInfo: null,
      login: async (username: string, password: string) => {
        try {
          const response = await api.post("/auth/login", {
            user_name: username,
            password: password,
          });

          // 处理嵌套数据结构 {code, data: {userId, username, token}, message}
          if (
            response.data &&
            response.data.code === 200 &&
            response.data.data
          ) {
            const userData = response.data.data;

            set({
              isLoggedIn: true,
              userInfo: {
                userId: userData.userId,
                username: userData.username,
                token: userData.token,
              },
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("登录失败:", error);
          return false;
        }
      },
      register: async (username: string, password: string) => {
        try {
          const response = await api.post("/auth/register", {
            user_name: username,
            password: password,
          });

          // 处理嵌套数据结构 {code, data: {userId, username, token}, message}
          if (
            response.data &&
            response.data.code === 200 &&
            response.data.data
          ) {
            const userData = response.data.data;

            set({
              isLoggedIn: true,
              userInfo: {
                userId: userData.userId,
                username: userData.username,
                token: userData.token,
              },
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("注册失败:", error);
          return false;
        }
      },
      logout: () => {
        set({
          isLoggedIn: false,
          userInfo: null,
        });
      },
    }),
    {
      name: STORAGE_CONFIG.USER_STORE_KEY,
    }
  )
);

// 创建主题状态管理
const useThemeStore = create(
  persist<ThemeStore>(
    (set) => ({
      mode: "system", // 默认使用系统主题
      setMode: (mode: ThemeMode) => set({ mode }),
    }),
    {
      name: STORAGE_CONFIG.THEME_STORE_KEY,
    }
  )
);

export { useCountStore, useUserStore, useThemeStore };
