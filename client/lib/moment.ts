import api from "./api";

export async function likeMoment(
  user_id: number,
  moment_id: number,
  status: boolean
) {
  api.post("/moments/like", JSON.stringify({ user_id, moment_id, status }));
}

export interface MomentComment {
  count: number;
  comments: any;
}
export async function getMomentComments(moment_id: number): Promise<MomentComment> {
  return await api.get("/moments/" + moment_id + "/comments");
}

export async function PostComment(moment_id: number, content: string) {
  return await api.post(
    "/moments/" + moment_id + "/comment",
    JSON.stringify({ moment_id, content })
  );
}

export async function createMoment(payload: {
  content: string;
  images: string[]; // 可以是 URL 或本地 URI，需视后端而定
  visibility: number;
}) {
  return await api.post("/moments", payload);
}

interface User {
  id: number;
  name: string;
  avatar: string;
  distance: string;
}

interface PostInfo {
  id: number;
  user_id: number;
  content: string;
  images: string[];
  location: string;
  created_at: string;
  visibility: number;
}

export interface Post {
  owner: User;
  moment: PostInfo;
  liked: boolean;
  like_count: number;
}

export interface MomentResp {
  count: number;
  moments: Post[];
}

// 获取所有moments，不区分用户
export async function GetMoments(): Promise<MomentResp> {
  return await api.get("/moments");
}

export default {
  likeMoment: likeMoment,
  getMomentComments: getMomentComments,
};
