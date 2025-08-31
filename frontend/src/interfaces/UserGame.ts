// src/interfaces/UserGame.ts
import type { User } from "./User";
import type { Game } from "./Game";

export interface UserGame {
  ID: number;
  status: string;         // "active" | "revoked" | ...
  granted_at: string;     // ISO date string
  revoked_at?: string | null;
  game_id: number;
  game?: Game;
  user_id: number;
  user?: User;
}

export interface CreateUserGameRequest {
  status: string;
  granted_at: string;
  revoked_at?: string | null;
  game_id: number;
  user_id: number;
}

export interface UpdateUserGameRequest {
  ID: number;
  status?: string;
  granted_at?: string;
  revoked_at?: string | null;
  game_id?: number;
  user_id?: number;
}
