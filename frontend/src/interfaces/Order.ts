import type { User } from "./User";
import type { OrderItem } from "./OrderItem";
import type { Payment } from "./Payment";
import type { OrderPromotion } from "./OrderPromotion";

export interface Order {
  ID: number;
  total_amount: number;
  order_create: string;   // ISO datetime
  order_status: string;   // e.g., "pending" | "paid" | "cancelled"
  user_id: number;
  user?: User;

  // relations
  order_items?: OrderItem[];
  payments?: Payment[];
  order_promotions?: OrderPromotion[];
}

export interface CreateOrderRequest {
  total_amount: number;
  order_status: string;
  user_id: number;
  order_create?: string; // ถ้าไม่ส่ง backend จะใส่ให้
}

export interface UpdateOrderRequest {
  ID: number;
  total_amount?: number;
  order_status?: string;
  order_create?: string;
}
