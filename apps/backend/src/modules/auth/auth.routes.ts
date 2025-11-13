import { Router } from "express";
import authController from "./auth.controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { validateSchema } from "../../middleware/validateSchema.js";
import { registerServerSchema } from "./auth.schema.js";

const router: Router = Router();

router.post(
  "/register",
  validateSchema(registerServerSchema),
  authController.register
);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authMiddleware(), authController.logout);

export default router;
