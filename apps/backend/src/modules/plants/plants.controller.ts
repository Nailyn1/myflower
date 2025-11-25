import { Request, response, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import plantsService from "./plants.service.js";

class PlantController {
  createPlant = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }
    await plantsService.createPlantById(data, idempotencyKey, res);
  });

  createPlantType = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    const idempotencyKey = req.idempotencyKey;
    if (!idempotencyKey) {
      return res.status(400).json({ error: "Idempotency-Key is required." });
    }

    const result = await plantsService.creatPlantType(data, idempotencyKey);
    res.status(201).json({ message: result });
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
}

export default new PlantController();
