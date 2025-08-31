// src/interfaces/Attachment.ts
import type { User } from "./User";
import type { TargetType } from "./Reaction";

export interface Attachment {
  ID: number;
  target_type: TargetType; // "thread" | "comment"
  target_id: number;
  file_url: string;
  user_id: number;
  user?: User;
}

export interface CreateAttachmentRequest {
  target_type: TargetType;
  target_id: number;
  file_url: string;
  user_id: number;
}

export interface UpdateAttachmentRequest {
  ID: number;
  target_type?: TargetType;
  target_id?: number;
  file_url?: string;
}
