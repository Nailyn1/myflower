import { z } from "zod";

export const idSchema = z
  .string()
  .refine((v) => /^\d+$/.test(v), "ID must be a positive integer")
  .transform((v) => Number(v))
  .refine((num) => Number.isInteger(num) && num > 0, "Invalid ID");

export type Id = z.infer<typeof idSchema>;
