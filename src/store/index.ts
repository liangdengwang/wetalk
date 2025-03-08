import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CountStore {
  count: number;
  inc: () => void;
}

interface UserStore {
  isLoggedIn: boolean;
  userInfo: {
    email: string;
    token: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
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
      login: async (email: string, password: string) => {
        if (email && password) {
          set({
            isLoggedIn: true,
            userInfo: {
              email,
              token: `mock_token_${Date.now()}`,
            },
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({
          isLoggedIn: false,
          userInfo: null,
        });
      },
    }),
    {
      name: "user-store",
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
      name: "theme-store",
    }
  )
);

export { useCountStore, useUserStore, useThemeStore };
