import {
  CreatePlantDto,
  CreatePlantResponseDto,
  CreatePlantTypeOrTagDto,
  GetPlantsResponseDto,
  UpdatePlantTypeDto,
} from "@myflower/shared";
import { Response } from "express";
import { plantRepository } from "./plants.repository.js";
import { generatePresignedUrls } from "../../libs/s3Service.js";
import { addPlantImage } from "./plants.schema.js";

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

      await Promise.all(dbPromises);

      const { createdAt, updatedAt, typeId, ...restOfPlant } = fullPlant;

      const responseData: CreatePlantResponseDto = {
        plant: {
          ...restOfPlant,
          price: restOfPlant.price ? restOfPlant.price.toNumber() : null,
          status: restOfPlant.status as "FOR_SALE" | "COLLECTION",
        },
        images: presignedUrls.map((item) => {
          const { mimeType, plantId, ...rest } = item;
          return rest;
        }),
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
    console.log(skip);
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
}

export default new PlantService();
