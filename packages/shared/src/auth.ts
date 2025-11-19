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

export const userUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    oldPassword: z.string().min(6).optional(),
    newPassword: z.string().min(6).optional(),
  })
  .refine((data) => data.name || data.email || data.newPassword, {
    message: "No fields to update",
  })
  .refine(
    (data) => {
      if (data.oldPassword || data.newPassword) {
        return data.oldPassword && data.newPassword;
      }
      return true;
    },
    {
      message:
        "Both oldPassword and newPassword are required to change password",
    }
  )
  .strict();

export type UserUpdateData = z.infer<typeof userUpdateSchema>;
