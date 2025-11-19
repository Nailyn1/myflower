import { Request, Response, NextFunction } from "express";
import { userUpdateSchema } from "@myflower/shared";
import { asyncHandler } from "./asyncHandler.js";

export const validateUpdate = () =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const parsed = userUpdateSchema.safeParse(req.body);

    if (!parsed.success) {
      return next(parsed.error);
    }

    req.validatedData = parsed.data;
    next();
  });
