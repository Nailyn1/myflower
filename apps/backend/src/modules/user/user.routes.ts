import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import userController from "./user.controller.js";

const router: Router = Router();

router.get("/me", authMiddleware(), userController.getUser);

export default router;
