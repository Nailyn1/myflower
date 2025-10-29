import { Router } from "express";
import { testEndpoint } from "./auth.controller.js";

const router: Router = Router();

router.get("/test", testEndpoint);

export default router;
