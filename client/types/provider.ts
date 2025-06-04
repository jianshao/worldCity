import { UserInfo } from "@/lib/user";

export interface ProviderResp {
  user_id: number;
  user: UserInfo;
  category: any;
  id: number;
  category_id: number;
  desc: string;
  price: number;
  is_active: boolean;
  title: string;
  images: string[];
}

export interface ProviderListResp {
  count: number;
  providers: ProviderResp[];
}

export interface ProductResp {
  provider: ProviderResp;
  status: boolean;
  score: number;
  orders: number;
  comments: number;
  available_time: string;
}

export interface ProductListResp {
  count: number;
  providers: ProductResp[];
}
