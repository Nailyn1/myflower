import { Router } from "express";
import { idempotencyMiddleware } from "../../middleware/withIdempotency.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import plantsController from "./plants.controller.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import {
  createPlantSchema,
  createPlantTypeSchema,
  updatePlantTypeSchema,
} from "@myflower/shared";

const router: Router = Router();

router.post(
  "/create",
  validateSchema(createPlantSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.createPlant
);

router.post(
  "/types",
  validateSchema(createPlantTypeSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.createPlantType
);
router.get("/types", plantsController.getAllPlantType);
router.patch(
  "/types/:id",
  authMiddleware(),
  validateSchema(updatePlantTypeSchema),
  plantsController.updatePlantType
);
router.delete("/types/:id", authMiddleware(), plantsController.deletePlantType);

router.post(
  "/tags",
  validateSchema(createPlantTypeSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.createPlantTag
);
router.get("/tags", plantsController.getAllPlantTags);
router.patch(
  "/tags/:id",
  authMiddleware(),
  validateSchema(updatePlantTypeSchema),
  plantsController.updatePlantTags
);
router.delete("/tags/:id", authMiddleware(), plantsController.deletePlantTags);
export default router;
