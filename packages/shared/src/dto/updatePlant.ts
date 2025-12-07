import z from "zod";
import { createPlantSchema, plantResponseSchema } from "../plant.js";

export const updatePlantSchema = createPlantSchema
  .pick({
    name: true,
    status: true,
    description: true,
    price: true,
    typeId: true,
    tags: true,
  })
  .partial();

export type UpdatePlantDto = z.infer<typeof updatePlantSchema>;

export type UpdatePlantResponseDto = z.infer<typeof plantResponseSchema>;
