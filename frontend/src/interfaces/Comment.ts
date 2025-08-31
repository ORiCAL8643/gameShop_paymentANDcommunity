// src/interfaces/Comment.ts
import type { User } from "./User";
import type { Thread } from "./Thread";

export interface Comment {
  ID: number;
  content: string;
  user_id: number;
  user?: User;
  thread_id: number;
  thread?: Thread;
  parent_comment_id?: number | null;
  parent?: Comment;
  replies?: Comment[];
}

export interface CreateCommentRequest {
  content: string;
  user_id: number;
  thread_id: number;
  parent_comment_id?: number | null;
}

export interface UpdateCommentRequest {
  ID: number;
  content?: string;
  parent_comment_id?: number | null;
}
