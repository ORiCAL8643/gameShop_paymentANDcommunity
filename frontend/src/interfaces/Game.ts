// src/interfaces/Game.ts
export interface Game {
  ID: number;
  game_name: string;
  game_price: number;
  description: string;
  // relations
  threads?: Thread[];
  user_games?: UserGame[];
}

export interface CreateGameRequest {
  game_name: string;
  game_price: number;
  description: string;
}

export interface UpdateGameRequest {
  ID: number;
  game_name?: string;
  game_price?: number;
  description?: string;
}

import type { Thread } from "./Thread";
import type { UserGame } from "./UserGame";
