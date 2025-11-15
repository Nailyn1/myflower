import { asyncHandler } from "../../middleware/asyncHandler.js";
import { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
  getUser = asyncHandler(async (req: Request, res: Response) => {
    await userService.getUserById(req.user!.id, res);
  });
}

export default new UserController();
