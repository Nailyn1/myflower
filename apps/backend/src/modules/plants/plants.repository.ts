import { Response } from "express";
import prisma from "../../prisma/prisma.service.js";
import { CreatePlantDto } from "@myflower/shared";
import { addPlantImage } from "./plants.schema.js";
import { json } from "zod";

type CreatePlantType = Pick<CreatePlantDto, "name" | "status">;

export const plantRepository = {
  createPlant: async (data: CreatePlantType) => {
    return prisma.plant.create({
      data: {
        name: data.name,
        status: data.status,
      },
    });
  },
  addPlantImage: async (data: addPlantImage) => {
    return prisma.plantImage.create({
      data,
    });
  },
  updateIdempotencyRecord: async <T>(
    key: string,
    responseData: T,
    status: number
  ) => {
    return prisma.idempotencyRecord.update({
      where: {
        key: key,
        locked: true,
      },
      data: {
        responseBody: JSON.stringify(responseData),
        responseStatus: status,
        locked: false,
        updatedAt: new Date(),
      },
    });
  },
};
