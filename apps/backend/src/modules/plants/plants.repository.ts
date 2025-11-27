import prisma from "../../prisma/prisma.service.js";
import {
  CreatePlantDto,
  CreatePlantTypeDto,
  UpdatePlantTypeDto,
} from "@myflower/shared";
import { addPlantImage } from "./plants.schema.js";

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
  createPlantType: async (data: CreatePlantTypeDto) => {
    return prisma.plantType.create({
      data,
    });
  },
  getAllPlantType: async () => {
    return prisma.plantType.findMany({
      orderBy: { id: "asc" },
    });
  },
  updatePlantType: async (typeid: number, data: UpdatePlantTypeDto) => {
    return prisma.plantType.update({
      where: {
        id: typeid,
      },
      data,
    });
  },
  deletePlantType: async (typeId: number) => {
    return prisma.plantType.deleteMany({
      where: {
        id: typeId,
      },
    });
  },

  createPlantTags: async (data: CreatePlantTypeDto) => {
    return prisma.tags.create({
      data,
    });
  },
  getAllPlantTags: async () => {
    return prisma.tags.findMany({
      orderBy: { id: "asc" },
    });
  },
  updatePlantTags: async (typeid: number, data: UpdatePlantTypeDto) => {
    return prisma.tags.update({
      where: {
        id: typeid,
      },
      data,
    });
  },
  deletePlantTags: async (typeId: number) => {
    return prisma.tags.deleteMany({
      where: {
        id: typeId,
      },
    });
  },
};
