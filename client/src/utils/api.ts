import axios from "axios";
import { API_CONFIG } from "./config";
import { useUserStore } from "../store";

// 创建API实例
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    // 获取用户token
    const userInfo = useUserStore.getState().userInfo;

    // 如果有token，添加到请求头
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    // 直接返回数据
    return response;
  },
  (error) => {
    // 处理响应错误
    if (error.response) {
      // 服务器返回了错误状态码
      const status = error.response.status;

      // 401未授权
      if (status === 401) {
        // 登出用户
        useUserStore.getState().logout();
        // 重定向到登录页
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
