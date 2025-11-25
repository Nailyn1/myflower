import { Response, Request, NextFunction } from "express";
import prisma from "../prisma/prisma.service.js";

export const idempotencyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers["idempotency-key"] as string;
    if (!key) {
      return res
        .status(400)
        .json({ message: "Idempotency-Key header required" });
    }

    const endpoint = req.originalUrl;

    const record = await prisma.idempotencyRecord.findUnique({
      where: { key },
    });

    if (record) {
      if (record.locked) {
        return res
          .status(409)
          .json({ message: "Request is already in progress" });
      }
      if (record.responseBody && record.responseStatus) {
        if (typeof record.responseBody === "string") {
          const responseData = JSON.parse(record.responseBody);
          return res.status(record.responseStatus).json(responseData);
        }
      }
    } else {
      await prisma.idempotencyRecord.create({
        data: {
          key,
          endpoint,
          locked: true,
        },
      });
    }

    req.idempotencyKey = key;

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
