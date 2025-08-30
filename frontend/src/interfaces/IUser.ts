import type { Gender } from "./Gender";

export interface IUser {
  id: number;
  username: string;
  email: string;
  gender: Gender;
}
