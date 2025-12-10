import { Prisma, PlantImage } from "../../generated/prisma/client.js";
import prisma from "../../prisma/prisma.service.js";
import {
  CreatePlantDto,
  CreatePlantTypeOrTagDto,
  ReorderPlantImagesDto,
  UpdatePlantDto,
  UpdatePlantTypeDto,
} from "@myflower/shared";
import { addPlantImage } from "./plants.schema.js";

type CreatePlantType = Pick<
  CreatePlantDto,
  "name" | "status" | "description" | "price" | "tags" | "typeId"
>;

export const plantRepository = {
  createPlant: async (data: CreatePlantType) => {
    const plantData: Prisma.PlantCreateInput = {
      name: data.name,
      status: data.status,
      description: data.description,
      price: data.price,
    };

    if (data.typeId !== undefined && data.typeId !== null) {
      plantData.type = {
        connect: { id: data.typeId },
      };
    }

    if (data.tags && data.tags.length > 0) {
      plantData.tags = {
        connect: data.tags.map((tagId) => ({ id: tagId })),
      };
    }

    return prisma.plant.create({
      data: plantData,
    });
  },

  findFullPlant: async (id: number) => {
    return prisma.plant.findUniqueOrThrow({
      where: { id },
      include: {
        type: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true },
        },
      },
    });
  },

  findPlantById: async (id: number) => {
    return prisma.plant.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        price: true,
        images: {
          select: { id: true, imageUrl: true, order: true, main: true },
        },
        type: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true },
        },
      },
    });
  },

  getAllPlants: async (skip?: number, take?: number) => {
    return prisma.plant.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        price: true,
        images: {
          where: { main: true },
          select: { imageUrl: true },
        },
        type: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true },
        },
      },
    });
  },

  updatePlant: async (plantId: number, data: UpdatePlantDto) => {
    const { typeId, tags, ...restOfData } = data;

    const filteredScalars = Object.fromEntries(
      Object.entries(restOfData).filter(([, value]) => value !== undefined)
    );

    const updateData: Prisma.PlantUpdateInput = filteredScalars;

    if (typeId !== undefined) {
      updateData.type = {
        connect: { id: typeId },
      };
    }

    if (tags !== undefined) {
      updateData.tags = {
        set: tags.map((tagId) => ({ id: tagId })),
      };
    }

    const updatedPlant = await prisma.plant.update({
      where: { id: plantId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        price: true,
        type: {
          select: { id: true, name: true },
        },
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    return updatedPlant;
  },

  deletePlant: async (plantId: number) => {
    return prisma.plant.deleteMany({
      where: {
        id: plantId,
      },
    });
  },

  totalCountPlants: async () => {
    return prisma.plant.count();
  },

  addPlantImage: async (data: addPlantImage) => {
    return prisma.plantImage.create({
      data,
    });
  },

  reorderPlant: async (
    plantId: number,
    data: ReorderPlantImagesDto
  ): Promise<PlantImage[]> => {
    const nullifyOrders = prisma.plantImage.updateMany({
      where: { plantId: plantId },
      data: { order: null },
    });

    const updatePromises: Prisma.PrismaPromise<PlantImage>[] = data.images.map(
      (imageUpdate) => {
        return prisma.plantImage.update({
          where: {
            id: imageUpdate.imageId,
            plantId: plantId,
          },
          data: {
            order: imageUpdate.order,
          },
        });
      }
    );
    const [_, ...updatedImages] = await prisma.$transaction([
      nullifyOrders,
      ...updatePromises,
    ]);

    return updatedImages;
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
  createPlantType: async (data: CreatePlantTypeOrTagDto) => {
    return prisma.plantType.create({
      data,
    });
  },
  getAllPlantType: async () => {
    return prisma.plantType.findMany({
      orderBy: { id: "asc" },
    });
  },

  getPlantImagesById: async (plantId: number) => {
    return prisma.plantImage.findMany({
      where: { plantId: plantId },
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

  createPlantTags: async (data: CreatePlantTypeOrTagDto) => {
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
