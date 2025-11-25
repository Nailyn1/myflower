import {
  CreatePlantDto,
  CreatePlantResponseDto,
  CreatePlantTypeDto,
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
      };

      const plant = await plantRepository.createPlant(dataUpdated);

      const presignedUrls = await generatePresignedUrls(plant.id, data.images);
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

      const responseData: CreatePlantResponseDto = {
        plant: {
          id: plant.id,
          name: plant.name,
          status: plant.status as "FOR_SALE" | "COLLECTION",
        },
        images: presignedUrls.map((item) => ({
          fileName: item.fileName,
          key: item.key,
          order: item.order,
          main: item.main,
          uploadUrl: item.uploadUrl,
          fields: item.fields,
        })),
      };
      const responseStatus = 201;

      await plantRepository.updateIdempotencyRecord(
        idempotencyKey,
        responseData,
        responseStatus
      );

      return res.status(responseStatus).json(responseData);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create plant" });
    }
  }
  async creatPlantType(data: CreatePlantTypeDto, idempotencyKey: string) {
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
}

export default new PlantService();
