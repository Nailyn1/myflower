import { z } from "zod";

export interface LoginResponse {
  accessToken: string;
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
