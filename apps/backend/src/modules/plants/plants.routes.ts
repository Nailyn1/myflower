import { Router } from "express";
import { idempotencyMiddleware } from "../../middleware/withIdempotency.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import plantsController from "./plants.controller.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import { createPlantSchema } from "@myflower/shared";

const router: Router = Router();

router.post(
  "/create",
  validateSchema(createPlantSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.createPlant
);

export default router;
