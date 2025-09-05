import type { User } from "./User";
import type { OrderPromotion } from "./OrderPromotion";

export interface Promotion {
  ID: number;
  title: string;
  description: string;
  discount_value: number;
  start_date: string;   // ISO datetime
  end_date: string;     // ISO datetime
  promoname: string;

  createdby: number;
  creator?: User;

  order_promotions?: OrderPromotion[];
}

export interface CreatePromotionRequest {
  title: string;
  description: string;
  discount_value: number;
  start_date?: string;
  end_date?: string;
  promoname: string;
  createdby: number;
}

export interface UpdatePromotionRequest {
  ID: number;
  title?: string;
  description?: string;
  discount_value?: number;
  start_date?: string;
  end_date?: string;
  promoname?: string;
}
