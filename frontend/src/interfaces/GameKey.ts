import type { OrderItem } from "./OrderItem";
import type { Game } from "./Game";

export interface GameKey {
  ID: number;
  key_code: string;

  game_id: number;
  game?: Game;

  order_item_id?: number | null;
  order_item?: OrderItem | null;
}

export interface CreateGameKeyRequest {
  key_code: string;
  game_id: number;
}

export interface UpdateGameKeyRequest {
  ID: number;
  key_code?: string;
  game_id?: number;
  order_item_id?: number | null;
}
