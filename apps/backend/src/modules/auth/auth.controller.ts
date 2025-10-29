import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";

export const testEndpoint = asyncHandler(
  async (req: Request, res: Response) => {
    const { fail } = req.query;

    if (fail === "true") {
      const error = new Error("Тестовая ошибка!") as any;
      error.statusCode = 400;
      throw error;
    }

    res.json({ success: true, message: "Тестовый эндпоинт работает!" });
  }
);
