import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .refine((num) => num > 0, "page must be positive"),

  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .refine((num) => num > 0 && num <= 100, "limit must be between 1-100"),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
