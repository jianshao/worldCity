import * as SecureStore from "expo-secure-store";
import api from "./api";
import { UserInfo } from "./user";

const TOKEN_KEY = "user_token";

// export async function saveToken(token: string) {
//   await SecureStore.setItemAsync(TOKEN_KEY, token);
// }

// export async function getToken() {
//   return await SecureStore.getItemAsync(TOKEN_KEY);
// }

// export async function removeToken() {
//   await SecureStore.deleteItemAsync(TOKEN_KEY);
// }

interface LoginResp {
  token: string;
}

export async function Login(
  username: string,
  password: string
): Promise<LoginResp> {
  return await api.post("/auth/login", { username, password });
}

export async function SendCode(phone: string) {
  return await api.post("/auth/send_code", JSON.stringify({ phone }));
}

export async function VerifyCode(phone: string, code: string) {
  return await api.post("/auth/verify_code", { phone, code });
}

export async function Register(payload: any): Promise<LoginResp> {
  return await api.post("/auth/register", payload);
}
