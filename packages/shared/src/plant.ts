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
  status: z.enum(["FOR_SALE", "COLLECTION"]),
});

export const createPlantResponseSchema = z.object({
  plant: plantResponseSchema,
  images: z.array(presignedImageSchema),
});

export type CreatePlantResponseDto = z.infer<typeof createPlantResponseSchema>;
