import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import userController from "./user.controller.js";

const router: Router = Router();

router.get("/me", authMiddleware(), userController.getUser);
router.get("/:id", authMiddleware(), userController.getUserById);

export default router;
