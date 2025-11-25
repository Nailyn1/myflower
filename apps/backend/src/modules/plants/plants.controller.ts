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
}

export default new PlantController();
