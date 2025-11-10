import { z } from "zod";
import { Role } from "@myflower/backend/src/generated/prisma/client";

export interface AuthPayload {
  id: number;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthPayload;
}

export const userAuthBaseSchema = z.object({
  name: z.string().min(2, "Имя слишком короткое"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export const userLoginBaseSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});
