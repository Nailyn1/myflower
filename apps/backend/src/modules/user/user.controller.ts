import { asyncHandler } from "../../middleware/asyncHandler.js";
import { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
  getUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.getUserById(req.user!.id, res);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    console.log("userID:", userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    await userService.getUserById(userId, res);
  });
}

export default new UserController();
