import { Request, Response, NextFunction, RequestHandler } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (requiredRole?: string): RequestHandler =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = authHeader.split(" ")[1];

    let userData: any;
    try {
      userData = verifyAccessToken(accessToken);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: userData.id,
      role: userData.role,
    };

    if (requiredRole && req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  });
