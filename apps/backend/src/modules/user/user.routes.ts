import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import userController from "./user.controller.js";
import { validateUpdate } from "../../middleware/validateUpdate.js";

const router: Router = Router();

router.get("/me", authMiddleware(), userController.getUser);
router.get("/:id", authMiddleware(), userController.getUserById);
router.patch(
  "/edit",
  authMiddleware(),
  validateUpdate(),
  userController.updatedUser
);

export default router;
