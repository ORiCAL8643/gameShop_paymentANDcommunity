import type { Order } from "./Order";
import type { GameKey } from "./GameKey";

export interface OrderItem {
  ID: number;
  unit_price: number;
  qty: number;
  line_discount: number;
  line_total: number;

  order_id: number;
  order?: Order;

  game_key_id?: number | null;
  game_key?: GameKey | null;
}

export interface CreateOrderItemRequest {
  unit_price: number;
  qty: number;
  line_discount: number;
  order_id: number;
  game_key_id?: number | null;
}

export interface UpdateOrderItemRequest {
  ID: number;
  unit_price?: number;
  qty?: number;
  line_discount?: number;
  line_total?: number;
  game_key_id?: number | null;
}
