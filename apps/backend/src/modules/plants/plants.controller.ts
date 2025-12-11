import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import plantsService from "./plants.service.js";
import { paginationSchema, ReorderPlantImagesDto } from "@myflower/shared";

class PlantController {
  createPlant = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }
    await plantsService.createPlantById(data, idempotencyKey, res);
  });

  getAllPlants = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = paginationSchema.parse(req.query);
    const result = await plantsService.getAllPlants(page, limit);
    res.status(201).json(result);
  });
  getPlantById = asyncHandler(async (req: Request, res: Response) => {
    const plantId = Number(req.params.id);
    if (!Number.isInteger(plantId) || plantId <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plant id" });
    }
    const result = await plantsService.getPlantsById(plantId);
    res.status(201).json(result);
  });

  updatePlantById = asyncHandler(async (req: Request, res: Response) => {
    const plantId = Number(req.params.id);
    const idempotencyKey = req.idempotencyKey;
    const data = req.body;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }
    const result = await plantsService.updatePlant(
      plantId,
      idempotencyKey,
      data
    );
    res.status(200).json(result);
  });

  deletePlantById = asyncHandler(async (req: Request, res: Response) => {
    const plantId = Number(req.params.id);
    const result = await plantsService.deletePlant(plantId);
    res.status(204).json(result);
  });

  createPlantType = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }

    const result = await plantsService.creatPlantType(data, idempotencyKey);
    res.status(201).json(result);
  });

  updatePlantType = asyncHandler(async (req: Request, res: Response) => {
    const typeId = Number(req.params.id);
    const data = req.body;
    const result = await plantsService.updatePlantType(typeId, data);
    res.status(201).json(result);
  });
  deletePlantType = asyncHandler(async (req: Request, res: Response) => {
    const typeId = Number(req.params.id);
    const result = await plantsService.deletePlantType(typeId);
    res.status(204).json(result);
  });
  getAllPlantType = asyncHandler(async (req: Request, res: Response) => {
    const result = await plantsService.getAllPlantTypes();
    res.status(201).json(result);
  });

  createPlantTag = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }

    const result = await plantsService.createTag(data, idempotencyKey);
    res.status(201).json(result);
  });
  getAllPlantTags = asyncHandler(async (req: Request, res: Response) => {
    const result = await plantsService.getAllPlantTags();
    res.status(201).json(result);
  });
  updatePlantTags = asyncHandler(async (req: Request, res: Response) => {
    const typeId = Number(req.params.id);
    const data = req.body;
    const result = await plantsService.updatePlantTags(typeId, data);
    res.status(201).json(result);
  });
  deletePlantTags = asyncHandler(async (req: Request, res: Response) => {
    const typeId = Number(req.params.id);
    const result = await plantsService.deletePlantTags(typeId);
    res.status(204).json(result);
  });

  createImgPlant = asyncHandler(async (req: Request, res: Response) => {
    const plantId = Number(req.params.id);
    const data = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }
    const result = await plantsService.createImg(
      plantId,
      idempotencyKey,
      data.images
    );
    res.status(201).json(result);
  });

  reorderImgPlant = asyncHandler(async (req: Request, res: Response) => {
    const plantId = Number(req.params.id);
    const data: ReorderPlantImagesDto = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }
    const result = await plantsService.reorderImg(
      plantId,
      idempotencyKey,
      data
    );
    res.status(201).json(result);
  });
}

export default new PlantController();
