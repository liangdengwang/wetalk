/**
 * 应用配置文件
 * 集中管理所有环境变量和配置信息
 */

// API配置
export const API_CONFIG = {
  // API基础URL
  BASE_URL: "http://localhost:3000/api",

  // API超时时间（毫秒）
  TIMEOUT: 10000,

  // API版本
  VERSION: "v1",
};

// 路由配置
export const ROUTE_CONFIG = {
  // 登录后默认跳转页面
  DEFAULT_REDIRECT: "/home",

  // 需要登录才能访问的路由
  PROTECTED_ROUTES: ["/home", "/contacts", "/setting"],

  // 登录页面
  LOGIN_ROUTE: "/login",
};

// 存储配置
export const STORAGE_CONFIG = {
  // 用户信息存储键名
  USER_STORE_KEY: "user-store",

  // 主题存储键名
  THEME_STORE_KEY: "theme-store",
};
