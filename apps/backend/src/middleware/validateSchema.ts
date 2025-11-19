import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";
import { asyncHandler } from "./asyncHandler.js";

export const validateSchema = (schema: ZodSchema<any>): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Парсим тело запроса через Zod
    req.body = schema.parse(req.body);
    next();
  });
