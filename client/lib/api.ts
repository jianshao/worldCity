import axios, { AxiosError } from "axios";
import { getToken, deleteToken } from "@/utils/tokenStorage";
import { router } from "expo-router";
import { Alert, Platform } from "react-native";

interface ApiBackendResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

type UnwrappedApiResponse<T> = T;

const api = axios.create({
  baseURL: "http://localhost:15151/api", // "http://api.takecares.cn/api"
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 请求拦截器 ---
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// --- 响应拦截器 ---
api.interceptors.response.use(
  (response): UnwrappedApiResponse<any> | Promise<never> => {
    const status = response.status;
    const resData = response.data as ApiBackendResponse;

    // 1. 基本的 HTTP 状态码检查 (理论上 axios 2xx 才进入这里，但双重检查无妨)
    if (status < 200 || status >= 300) {
      console.warn(`HTTP status ${status} received in success interceptor.`);
      return Promise.reject(new Error(`HTTP error! status: ${status}`));
    }

    // 2. 检查自定义业务状态码
    if (typeof resData.code !== "undefined" && resData.code !== 0) {
      const errorMsg = resData.message || `业务错误 (代码: ${resData.code})`;
      console.error(`Business Logic Error: ${errorMsg}, Code: ${resData.code}`);
      return Promise.reject(new Error(errorMsg));
    }

    // 3. 成功 - 只返回 'data' 部分
    if (typeof resData.data !== "undefined") {
      return resData.data;
    } else if (typeof resData.code === "undefined") {
      console.warn(
        "Response structure doesn't match expected { code, data, message }. Returning full response data."
      );
      return resData as any;
    } else {
      return {} as any;
    }
  },

  (error: AxiosError<ApiBackendResponse>): Promise<never> => {
    let errorMessage = "发生未知错误";

    if (error.response) {
      // 服务器返回了响应，但状态码非 2xx
      const status = error.response.status;
      const responseData = error.response.data;
      errorMessage =
        responseData?.message || error.message || `请求失败，状态码: ${status}`;

      console.error(
        `HTTP Error Response: Status=${status}, Message=${errorMessage}`,
        responseData
      );

      switch (status) {
        case 401:
          errorMessage = "认证失败或已过期，请重新登录";
          console.warn("Unauthorized (401). Redirecting to login.");
          deleteToken()
            .then(() => {
              setTimeout(() => router.replace("/auth/login"), 0);
            })
            .catch((e: any) => console.error("Failed to remove token:", e));
          break;
        case 403:
          errorMessage = "权限不足，无法访问此资源";
          console.warn("Forbidden (403).");
          if (Platform.OS !== "web") Alert.alert("无权限", errorMessage);
          break;
        case 404:
          errorMessage = "请求的资源未找到 (404)";
          console.warn("Not Found (404).");
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorMessage = "服务器开小差了，请稍后重试";
          console.error(`Server Error (${status}).`);
          if (Platform.OS !== "web") Alert.alert("服务器错误", errorMessage);
          break;
        default:
          errorMessage = responseData?.message || `请求错误 (${status})`;
          console.error(`Unhandled HTTP Error Status: ${status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应 (网络错误, 超时)
      errorMessage = "网络连接错误或服务器无响应，请检查网络";
      console.error("Network Error:", error.request);
      if (Platform.OS !== "web") Alert.alert("网络错误", errorMessage);
    } else {
      // 设置请求时发生的错误
      errorMessage = `请求设置错误: ${error.message}`;
      console.error("Request Setup Error:", error.message);
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
