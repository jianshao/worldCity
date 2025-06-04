import { ProviderListResp } from "@/types/provider";
import api from "./api";
import { MomentResp } from "./moment";
import { AddressListResp, AddressResp } from "@/types/user";

export interface VideoInfo {
  title: string;
  uri: string;
  access: string;
}

export interface UserInfo {
  id: number;
  nickname: string;
  avatar: string;
  height: number;
  weight: number;
  photos: string[];
  birthday: string;
  gender: number;
  tags: UserTag[];
  coins: number;
  desc: string;
  videos: VideoInfo[];
}

export interface UserListResp {
  count: number;
  users: UserInfo[];
}

export async function GetUserList(pageNum: number): Promise<UserListResp> {
  return await api.get(`/user/list?page_num=${pageNum}&page_size=10`);
}

export async function getUserInfo(uid: string): Promise<UserInfo> {
  return await api.get(`/user/${uid}`);
}

export async function SaveProfile(
  user_id: number,
  formData: any
): Promise<UserInfo> {
  return await api.post(`/user/${user_id}`, formData);
}

export async function checkLogin(): Promise<UserInfo> {
  return await api.get(`/user/check`);
}

export interface UserTag {
  id: number;
  user_id: number;
  tag: string;
}

export async function AddTag(user_id: number, tag: string): Promise<UserTag> {
  return await api.post(
    `/user/${user_id}/tags`,
    JSON.stringify({ user_id, tag })
  );
}

export interface UserTagInfoResp {
  count: number;
  tags: UserTag[];
}

export async function GetTags(user_id: number): Promise<UserTagInfoResp> {
  return await api.get(`/user/${user_id}/tags`);
}

export async function DeleteTag(user_id: number, tag_id: number) {
  return await api.delete(`/user/${user_id}/tags/${tag_id}`);
}

// 获取指定用户的moments
export async function GetUserMoments(user_id: number): Promise<MomentResp> {
  return await api.get(`/user/${user_id.toString()}/moments`);
}

export async function Recharge(user_id: number, coins: number) {
  return await api.post(`/user/${user_id}/recharge`, JSON.stringify({ coins }));
}

// 获取用户提供的服务
export async function GetUserServices(
  user_id: string
): Promise<ProviderListResp> {
  return await api.get(`/user/${user_id}/services`);
}

export async function GetUserAddresses(
  user_id: number
): Promise<AddressListResp> {
  return await api.get(`/user/${user_id}/addresses`);
}

export async function CreateAddress(
  user_id: number,
  payload: any
): Promise<AddressResp> {
  return await api.post(`/user/${user_id}/address`, JSON.stringify(payload));
}
