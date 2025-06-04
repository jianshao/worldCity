// src/types/order.ts

import { AddressResp } from "./user";

// --- Enums (Remain the same) ---
export enum OrderStatus {
  WaitForPayment = 0,
  Waiting = 1,
  Accepted = 2,
  Completed = 3,
  Cancelled = 4,
  Refunded = 5,
}

export enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
  Failed = 2,
  Refunding = 3,
  Refunded = 4,
}

// --- JSON Field Interfaces (Keep camelCase for TS consistency, or use snake_case if preferred) ---
// Option 1: Keep camelCase in TS for better readability internally
interface ProductSnapshot {
  title: string;
  desc: string;
  price: number;
  images: string[];
  options?: Record<string, any>;
}
interface DeliveryAddress {
  province: string;
  city: string;
  district: string;
  street: string;
}
interface UserContact {
  name: string;
  phone: string;
}
// Option 2: Use snake_case in TS interfaces (Less common, but aligns strictly with JSON)
/*
interface ProductSnapshotSnake { product_name: string; image_url: string; ... }
interface DeliveryAddressSnake { ... }
interface UserContactSnake { ... }
*/
// We'll proceed with Option 1 (camelCase for internal TS types of JSON fields) for better TS ergonomics,
// but the main response/request DTOs below *must* use snake_case for the top-level keys.

// --- Response DTOs (Updated to snake_case) ---
export interface OrderResponse {
  order_no: string;
  user_id: number;
  provider_id: number;
  product_snapshot: ProductSnapshot | null; // Internal type can remain camelCase
  unit_price: string; // Use string for decimal
  quantity: number;
  total_amount: string; // Use string for decimal
  status: OrderStatus;
  status_text: string;
  payment_status: PaymentStatus;
  payment_status_text: string;
  service_time: string | null; // ISO date string or null
  delivery_address: AddressResp | null; // Internal type can remain camelCase
  user_contact: UserContact | null; // Internal type can remain camelCase
  payment_time: string | null; // ISO date string or null
  order_time: string; // ISO date string
  accepted_time: string | null;
  completion_time: string | null;
  cancellation_time: string | null;
  cancellation_reason: string[] | Record<string, any> | null;
  created_at: string; // ISO date string
  score: number;
  tags: string[];
}

export interface OrderListResponse {
  orders: OrderResponse[];
  total: number;
  page: number;
  page_size: number; // Matches backend query param/response field
}

// --- Request DTOs (Updated to snake_case if applicable) ---
export interface CancelOrderRequest {
  // The key 'reason' itself might remain camelCase in the payload object,
  // because the Go binding uses `json:"reason"`.
  // If Go used `json:"cancellation_reason"`, this key would need to change.
  // Check your Go `CancelOrderRequest` struct's `json` tag. Assuming it's `json:"reason"`:
  reason: string[] | Record<string, any>;
}

// If you have a CreateOrderRequest type here, update its keys to snake_case

export interface CreateOrderRequest {
  provider_id: number;
  product_id: number;
  quantity: number;
  service_time?: string | null;
  delivery_address: DeliveryAddress;
  user_contact: UserContact;
}

export interface DeliveryAddressInput {
  // What frontend prepares for backend
  province: string;
  city: string;
  district: string;
  street: string;
  // Add other necessary fields like zipcode, full_address if needed
}

export interface UserContactInput {
  // What frontend prepares for backend
  name: string;
  phone: string;
}

// Match Go's models.CreateOrderRequest (snake_case keys in payload)
export interface CreateOrderPayload {
  provider_id: number;
  merchant_id: number;
  quantity: number;
  service_time?: string | null; // ISO string or null
  delivery_address: AddressResp;
  // user_contact: UserContactInput;
}

// Interface for Payment Method options displayed in the list
export interface PaymentMethod {
  id: string; // e.g., 'alipay', 'manual_recharge'
  name: string;
  icon: any; // Image source (require or { uri: ... })
}
