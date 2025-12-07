// src/schemas/plant-response.schema.ts
import { z } from "zod";
import { plantResponseSchema } from "../plant.js";

const plantItemSchema = plantResponseSchema.extend({
  imageUrl: z.string().nullable(),
});

export const getPlantsResponseSchema = z.object({
  data: z.array(plantItemSchema),
  pagination: z.object({
    totalCount: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    totalPages: z.number().int().min(0),
  }),
});

export type GetPlantsResponseDto = z.infer<typeof getPlantsResponseSchema>;
