import { Router, Request, Response } from "express";
import { idempotencyMiddleware } from "../../middleware/withIdempotency.js";
import prisma from "../../prisma/prisma.service.js";

const router: Router = Router();

export default router;
