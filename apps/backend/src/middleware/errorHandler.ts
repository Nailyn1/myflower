import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? "Внутренняя ошибка сервера" : err.message;

  // Логируем ошибку
  logger.error(`[${req.method} ${req.url}] ${message} - ${err.stack || err}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
