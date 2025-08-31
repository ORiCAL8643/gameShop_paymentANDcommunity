// src/interfaces/Thread.ts
import type { User } from "./User";
import type { Game } from "./Game";
import type { Comment } from "./Comment";

export interface Thread {
  ID: number;
  title: string;
  content: string;
  user_id: number;
  user?: User;
  game_id: number;
  game?: Game;
  comments?: Comment[];
}

export interface CreateThreadRequest {
  title: string;
  content: string;
  user_id: number;
  game_id: number;
}

export interface UpdateThreadRequest {
  ID: number;
  title?: string;
  content?: string;
  user_id?: number;
  game_id?: number;
}
