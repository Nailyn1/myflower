import {
  CreatePlantDto,
  CreatePlantResponseDto,
  CreatePlantTypeOrTagDto,
  GetPlantsResponseDto,
  PlantImageDto,
  ReorderPlantImagesDto,
  UpdatePlantDto,
  UpdatePlantResponseDto,
  UpdatePlantTypeDto,
} from "@myflower/shared";
import { Response } from "express";
import { plantRepository } from "./plants.repository.js";
import { generatePresignedUrls } from "../../libs/s3Service.js";
import { addPlantImage } from "./plants.schema.js";
import { NumberLiteralType } from "typescript";

class PlantService {
  async createPlantById(
    data: CreatePlantDto,
    idempotencyKey: string,
    res: Response
  ) {
    try {
      const dataUpdated = {
        name: data.name,
        status: data.status,
        description: data.description,
        price: data.price,
        typeId: data.typeId,
        tags: data.tags,
      };

      const createdPlant = await plantRepository.createPlant(dataUpdated);
      const fullPlant = await plantRepository.findFullPlant(createdPlant.id);

      const presignedUrls = await generatePresignedUrls(
        createdPlant.id,
        data.images
      );
      const dbPromises = presignedUrls.map((urlData) => {
        const imageData: addPlantImage = {
          imageUrl: urlData.key,
          plantId: urlData.plantId,
          order: urlData.order,
          main: urlData.main,
        };
        return plantRepository.addPlantImage(imageData);
      });

      const createdImages = await Promise.all(dbPromises);

      const responseImages = presignedUrls.map((item, index) => {
        const { mimeType, plantId, ...rest } = item;
        return {
          imageId: createdImages[index].id,
          ...rest,
        };
      });

      const { createdAt, updatedAt, typeId, ...restOfPlant } = fullPlant;

      const responseData: CreatePlantResponseDto = {
        plant: {
          ...restOfPlant,
          price: restOfPlant.price ? restOfPlant.price.toNumber() : null,
          status: restOfPlant.status as "FOR_SALE" | "COLLECTION",
        },
        images: responseImages,
      };
      const responseStatus = 201;

      await plantRepository.updateIdempotencyRecord(
        idempotencyKey,
        responseData,
        responseStatus
      );

      return res.status(responseStatus).json(responseData);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create plant", error });
    }
  }

  async getAllPlants(page: number = 1, limit: number = 10) {
    const skip: number = (page - 1) * limit;
    const plants = await plantRepository.getAllPlants(skip, limit);

    const totalCount = await plantRepository.totalCountPlants();
    const result: GetPlantsResponseDto = {
      data: plants.map((plant) => ({
        id: plant.id,
        name: plant.name,
        description: plant.description,
        status: plant.status,
        price: plant.price ? Number(plant.price) : null,
        imageUrl: plant.images[0]?.imageUrl || null,
        type: plant.type,
        tags: plant.tags,
      })),
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
    return result;
  }

  async getPlantsById(id: number) {
    const result = await plantRepository.findPlantById(id);

    const images = result.images.map(({ id, ...rest }) => ({
      imageId: id,
      ...rest,
    }));

    return { ...result, images };
  }

  async updatePlant(id: number, idempotencyKey: string, data: UpdatePlantDto) {
    const prismaResult = await plantRepository.updatePlant(id, data);
    const { price, ...restOfPlant } = prismaResult;
    const updatedPlant: UpdatePlantResponseDto = {
      ...restOfPlant,
      price: prismaResult.price ? prismaResult.price.toNumber() : null,
    };
    const responseStatus = 200;

    await plantRepository.updateIdempotencyRecord(
      idempotencyKey,
      updatedPlant,
      responseStatus
    );
    return updatedPlant;
  }

  async deletePlant(plantId: number) {
    const plant = await plantRepository.deletePlant(plantId);
    return plant;
  }

  async creatPlantType(data: CreatePlantTypeOrTagDto, idempotencyKey: string) {
    const plantType = await plantRepository.createPlantType(data);

    await plantRepository.updateIdempotencyRecord(
      idempotencyKey,
      plantType,
      201
    );

    return plantType;
  }

  async getAllPlantTypes() {
    const types = await plantRepository.getAllPlantType();
    return types;
  }

  async updatePlantType(typeId: number, data: UpdatePlantTypeDto) {
    const types = await plantRepository.updatePlantType(typeId, data);
    return types;
  }

  async deletePlantType(typeId: number) {
    const types = await plantRepository.deletePlantType(typeId);
    return types;
  }

  async createTag(data: CreatePlantTypeOrTagDto, idempotencyKey: string) {
    const plantTags = await plantRepository.createPlantTags(data);

    await plantRepository.updateIdempotencyRecord(
      idempotencyKey,
      plantTags,
      201
    );

    return plantTags;
  }

  async getAllPlantTags() {
    const PlantTags = await plantRepository.getAllPlantTags();
    return PlantTags;
  }

  async updatePlantTags(typeId: number, data: UpdatePlantTypeDto) {
    const PlantTags = await plantRepository.updatePlantTags(typeId, data);
    return PlantTags;
  }

  async deletePlantTags(typeId: number) {
    const PlantTags = await plantRepository.deletePlantTags(typeId);
    return PlantTags;
  }

  async createImg(
    plantId: number,
    idempotencyKey: string,
    data: PlantImageDto[]
  ) {
    if (!Array.isArray(data)) {
      throw new Error("images must be an array");
    }

    const existing = await plantRepository.getPlantImagesById(plantId);
    const existingOrders = existing.map((i) => i.order);

    const maxExistingOrder = existingOrders.length
      ? Math.max(...existingOrders)
      : -1;

    const newOrders = data.map((i) => i.order);
    const minNewOrder = Math.min(...newOrders);

    if (minNewOrder !== maxExistingOrder + 1) {
      throw new Error(
        `New images must start with order ${
          maxExistingOrder + 1
        }, but got ${minNewOrder}`
      );
    }

    const existingOrdersSet = new Set(existingOrders);
    for (const img of data) {
      if (existingOrdersSet.has(img.order)) {
        throw new Error(`Order ${img.order} already exists`);
      }
    }

    const hasMainInNew = data.some((i) => i.main);
    const existingMain = existing.find((i) => i.main);

    if (hasMainInNew && existingMain) {
      throw new Error(
        "This plant already has a main image. Change it via PATCH."
      );
    }

    const presignedUrls = await generatePresignedUrls(plantId, data);

    const dbPromises = presignedUrls.map((urlData) => {
      const imageData: addPlantImage = {
        imageUrl: urlData.key,
        plantId: urlData.plantId,
        order: urlData.order,
        main: urlData.main,
      };
      return plantRepository.addPlantImage(imageData);
    });

    const createdImages = await Promise.all(dbPromises);

    const responseImages = presignedUrls.map((item, index) => {
      const { mimeType, plantId, ...rest } = item;
      return {
        imageId: createdImages[index].id,
        ...rest,
      };
    });

    const responseStatus = 201;

    await plantRepository.updateIdempotencyRecord(
      idempotencyKey,
      responseImages,
      responseStatus
    );

    return responseImages;
  }

  async reorderImg(plantId: number, data: ReorderPlantImagesDto) {
    const existing = await plantRepository.getPlantImagesById(plantId);

    if (data.images.length !== existing.length) {
      throw new Error(
        `Client must send exactly ${existing.length} images for reordering, but received ${data.images.length}.`
      );
    }

    const clientImageIds = new Set(data.images.map((i) => i.imageId));
    const existingImageIds = new Set(existing.map((i) => i.id));
    for (const id of clientImageIds) {
      if (!existingImageIds.has(id)) {
        throw new Error(
          `Image ID ${id} in the request does not belong to plant ${existing[0].plantId} or does not exist.`
        );
      }
    }

    const responseData = await plantRepository.reorderPlant(plantId, data);
    return responseData;
  }
}

export default new PlantService();
