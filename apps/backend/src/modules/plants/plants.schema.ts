import { idSchema } from "@myflower/shared";
import z from "zod";

export interface addPlantImage {
  imageUrl: string;
  plantId: number;
  order: number;
  main: boolean;
}

export const deleteImgParamsSchema = z.object({
  id: idSchema,
  imageId: idSchema,
});

export type DeleteImgParams = z.infer<typeof deleteImgParamsSchema>;
