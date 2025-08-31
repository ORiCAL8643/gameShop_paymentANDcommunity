// src/interfaces/Reaction.ts
import type { User } from "./User";

export type TargetType = "thread" | "comment" | string; // ขยายได้ภายหลัง
export type ReactionType = "like" | "love" | "haha" | string;

export interface Reaction {
  ID: number;
  target_type: TargetType;
  target_id: number;
  type: ReactionType;
  user_id: number;
  user?: User;
}

export interface CreateReactionRequest {
  target_type: TargetType;
  target_id: number;
  type: ReactionType;
  user_id: number;
}

export interface UpdateReactionRequest {
  ID: number;
  target_type?: TargetType;
  target_id?: number;
  type?: ReactionType;
}
