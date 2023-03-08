import { User } from "@prisma/client";

export type UserInfo = Omit<User, "created_at" | "updated_at" | "password">;
export type Message = { message: string };

export type AppNotification = {
  message: string;
  type: "error" | "success" | "";
};

export type AppDialog = {
  isOpen: boolean;
  message: string;
  accept: () => any;
  reject: () => any;
};