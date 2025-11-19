import { asyncHandler } from "../../middleware/asyncHandler.js";
import { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
  getUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.getUserById(req.user!.id, res);
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    await userService.getUserById(userId, res);
  });

  updatedUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await userService.updateUser(userId, req.validatedData!, res);
  });
}

export default new UserController();
