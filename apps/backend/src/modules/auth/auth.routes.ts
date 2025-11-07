import { Router } from "express";
import authController from "./auth.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router: Router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authMiddleware(), authController.logout);

export default router;
