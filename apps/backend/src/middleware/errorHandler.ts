import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { ZodIssue } from "zod/v3";

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
  let statusCode = err instanceof ZodError ? 400 : err.statusCode || 500;
  let message =
    err instanceof ZodError
      ? "Ошибка валидации данных"
      : "Внутренняя ошибка сервера";
  let errors: { path: string; message: string }[] | undefined = undefined;

  // Обработка Zod ошибок
  if (err instanceof ZodError) {
    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else {
    statusCode = err.statusCode || 500;
    message = err.message || message;
  }

  // Логируем ошибку
  logger.error(`[${req.method} ${req.url}] ${message} - ${err.stack || err}`);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
