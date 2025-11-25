import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodObject, ZodRawShape } from "zod";
import { asyncHandler } from "./asyncHandler.js";

export const validateSchema = (
  schema: ZodObject<ZodRawShape>
): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  });
