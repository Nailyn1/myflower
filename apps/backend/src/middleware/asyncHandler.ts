import { Request, Response, NextFunction, RequestHandler } from "express";
import { logger } from "../config/logger.js";

export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      logger.error(`[${req.method} ${req.url}] ${err.message || err}`);
      next(err);
    });
  };
