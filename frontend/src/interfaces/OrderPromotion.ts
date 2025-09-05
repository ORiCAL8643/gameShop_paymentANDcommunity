import type { Order } from "./Order";
import type { Promotion } from "./Promotion";

export interface OrderPromotion {
  ID: number;
  discount_amount: number;

  order_id: number;
  order?: Order;

  promotion_id: number;
  promotion?: Promotion;
}

export interface CreateOrderPromotionRequest {
  discount_amount: number;
  order_id: number;
  promotion_id: number;
}
