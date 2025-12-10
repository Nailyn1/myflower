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
      const orderSet = new Set(imgs.map((i) => i.order));
      return orderSet.size === imgs.length;
    }, "Order values must be unique")
    .refine((imgs) => {
      const orders = imgs.map((i) => i.order).sort((a, b) => a - b);
      return orders.every((o, idx) => o === orders[0] + idx);
    }, "Order must be sequential without gaps (e.g., 4,5,6)"),
});

export const reorderPlantImageSchema = z.object({
  images: z
    .array(
      z.object({
        imageId: z.number().int().positive(),
        order: z.number().int().nonnegative(),
      })
    )
    .min(1, "At least one image required")
    .refine((imgs) => {
      const imageIdSet = new Set(imgs.map((i) => i.imageId));
      return imageIdSet.size === imgs.length;
    }, "Image IDs must be unique within the request.")
    .refine((imgs) => {
      const orderSet = new Set(imgs.map((i) => i.order));
      return orderSet.size === imgs.length;
    }, "Order values must be unique")
    .refine((imgs) => {
      const orders = imgs.map((i) => i.order).sort((a, b) => a - b);
      return orders.every((o, idx) => o === idx);
    }, "Orders must be sequential starting from 0"),
});

export type ReorderPlantImagesDto = z.infer<typeof reorderPlantImageSchema>;

export const reorderPlantImagesResponseSchema = z.object({
  images: z.array(
    z.object({
      imageId: z.number().int().positive(),
      order: z.number().int().nonnegative(),
      main: z.boolean(),
      imageUrl: z.string(),
    })
  ),
});

export type ReorderPlantImagesResponseDto = z.infer<
  typeof reorderPlantImagesResponseSchema
>;
