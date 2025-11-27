import { z } from "zod";

export const imageSchema = z.object({
  fileName: z.string(),
  mimeType: z.enum(["image/png", "image/jpeg"]),
  order: z.number().int().min(0),
  main: z.boolean(),
});

export const createPlantSchema = z.object({
  name: z.string().min(1),
  status: z.enum(["FOR_SALE", "COLLECTION"]),
  description: z.string().nullable().optional(),
  price: z.number().int().nonnegative().nullable().optional(),
  typeId: z.number().int().positive().optional(),
  tags: z.array(z.number().int().positive()).optional(),
  images: z
    .array(imageSchema)
    .min(1, "At least one image required")
    .max(10, "Maximum 10 images allowed")
    .refine(
      (imgs) => imgs.filter((i) => i.main).length === 1,
      "Exactly one image must have main = true"
    )
    .refine((imgs) => imgs.some((i) => i.order === 0), "Order must start at 0")
    .refine((imgs) => {
      const orders = imgs.map((i) => i.order).sort((a, b) => a - b);
      return orders.every((o, idx) => o === idx);
    }, "Order must be sequential without gaps (0,1,2...)"),
});

export type CreatePlantDto = z.infer<typeof createPlantSchema>;
export type PlantImageDto = z.infer<typeof imageSchema>;

export const plantTypeOrTagResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export const presignedImageSchema = z.object({
  fileName: z.string(),
  key: z.string(),
  order: z.number(),
  main: z.boolean(),
  uploadUrl: z.string(),
  fields: z.record(z.string(), z.string()),
});

export const plantResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.number().int().nonnegative().nullable().optional(),
  type: plantTypeOrTagResponseSchema.nullable().optional(),
  tags: z.array(plantTypeOrTagResponseSchema).optional(),
  status: z.enum(["FOR_SALE", "COLLECTION"]),
});

export const createPlantResponseSchema = z.object({
  plant: plantResponseSchema,
  images: z.array(presignedImageSchema),
});

export type CreatePlantResponseDto = z.infer<typeof createPlantResponseSchema>;

export const createPlantTypeOrTagSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type CreatePlantTypeOrTagDto = z.infer<
  typeof createPlantTypeOrTagSchema
>;
export type PlantTypeOrTagResponseDto = z.infer<
  typeof plantTypeOrTagResponseSchema
>;

export const updatePlantTypeSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type UpdatePlantTypeDto = z.infer<typeof updatePlantTypeSchema>;
