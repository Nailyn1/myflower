import { Response } from "express";
import { z } from "zod";
import { userAuthBaseSchema, userLoginBaseSchema } from "@myflower/shared";
import { Role } from "../../generated/prisma/client.js";

export const registerServerSchema = userAuthBaseSchema.strict();
export type RegisterInput = z.infer<typeof registerServerSchema>;

export const loginServerSchema = userLoginBaseSchema.strict();
export type LoginInput = z.infer<typeof loginServerSchema>;

export interface SendTokensInput {
  res: Response;
  userId: number;
  role: Role;
}

export interface DecodedType {
  id: number;
  role: Role;
}
