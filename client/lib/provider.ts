import { ProductListResp, ProviderResp } from "@/types/provider";
import api from "./api";
import { UserInfo } from "./user";

export async function GetCategorys() {
  return await api.get("/categories/list");
}

export async function GetServiceProviders(
  category_id: number
): Promise<ProductListResp> {
  return await api.get(`/categories/${category_id}/providers`);
}

export async function GetProviderById(
  provider_id: string
): Promise<ProviderResp> {
  return await api.get(`/provider/${provider_id}`);
}
