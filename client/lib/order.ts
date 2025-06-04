import {
  CreateOrderPayload,
  OrderListResponse,
  OrderResponse,
} from "@/types/order";
import api from "./api";

export async function CreateOrder(
  payload: CreateOrderPayload
): Promise<OrderResponse> {
  return await api.post("/orders", JSON.stringify(payload));
}

export async function CancelOrder(orderNo: string, reason: string[]) {
  return await api.patch(`/orders/${orderNo}/cancel`, { reason });
}
export async function GetOrder(orderNo: string): Promise<OrderResponse> {
  return await api.get(`/orders/${orderNo}`);
}

interface GetOrderListPayload {
  page: number;
  page_size: number;
  status?: number;
}

export async function GetOrderList(
  payload: GetOrderListPayload
): Promise<OrderListResponse> {
  return await api.get(`/orders`, { params: payload });
}

interface ReviewOrderPayload {
  score: number;
  order_no: string;
  tags: string[];
}

export async function ReviewOrder(payload: ReviewOrderPayload) {
  return await api.post(
    `/orders/${payload.order_no}/review`,
    JSON.stringify(payload)
  );
}
