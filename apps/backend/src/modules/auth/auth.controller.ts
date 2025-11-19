import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import authService from "./auth.service.js";
import { RegisterInput } from "./auth.schema.js";

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterInput = req.body;
    await authService.register(data, res);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    await authService.login(data, res);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    await authService.refresh(refreshToken, res);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.id, res);
  });
}

export default new AuthController();
