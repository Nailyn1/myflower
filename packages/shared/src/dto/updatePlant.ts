import z from "zod";
import {
  createPlantSchema,
  plantResponseSchema,
  imageSchema,
} from "../plant.js";

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

export const addPlantImagesSchema = z.object({
  images: z
    .array(imageSchema)
    .min(1, "At least one image required")
    .max(10, "Maximum 10 images allowed")
    .refine((imgs) => {
      const orders = imgs.map((i) => i.order);
      const unique = new Set(orders);
      return unique.size === orders.length;
    }, "Order values must be unique")
    .refine((imgs) => {
      const orders = imgs.map((i) => i.order).sort((a, b) => a - b);
      return orders.every((o, idx) => o === orders[0] + idx);
    }, "Order must be sequential without gaps (e.g., 4,5,6)"),
});
