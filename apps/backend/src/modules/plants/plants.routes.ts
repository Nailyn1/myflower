import { Router } from "express";
import { idempotencyMiddleware } from "../../middleware/withIdempotency.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import plantsController from "./plants.controller.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import {
  addPlantImagesSchema,
  createPlantSchema,
  createPlantTypeOrTagSchema,
  imageSchema,
  updatePlantSchema,
  updatePlantTypeSchema,
} from "@myflower/shared";

const router: Router = Router();

router.post(
  "/",
  validateSchema(createPlantSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.createPlant
);

router.get("/", plantsController.getAllPlants);
router.get("/:id(\\d+)", plantsController.getPlantById);
router.patch(
  "/:id",
  validateSchema(updatePlantSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.updatePlantById
);
router.delete("/:id(\\d+)", plantsController.deletePlantById);

router.post(
  "/types",
  validateSchema(createPlantTypeOrTagSchema),
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
  validateSchema(createPlantTypeOrTagSchema),
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

router.post(
  "/:id/images",
  validateSchema(addPlantImagesSchema),
  authMiddleware(),
  idempotencyMiddleware,
  plantsController.createImgPlant
);
export default router;
