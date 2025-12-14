import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { ApiError } from "../errors/index.js";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal sever error";
  let errors: { path: string; message: string }[] | undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Data validation error";
    errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplication of data";
        break;
      case "P2025":
        statusCode = 404;
        message = "The resourse was not found";
        break;
      default:
        statusCode = 500;
        message = "Database error";
    }
  } else if (err instanceof Error) {
    statusCode = 500;
    message = "Internal server error";
  }

  logger.error({
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === "development" &&
      err instanceof Error && { stack: err.stack }),
  });
};
