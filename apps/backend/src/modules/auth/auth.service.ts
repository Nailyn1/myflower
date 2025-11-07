import { verifyRefreshToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { authRepository } from "./auth.repository.js";
import { LoginInput, RegisterInput } from "./auth.schema.js";
import { tokenService } from "./token.service.js";
import { Response } from "express";

class AuthService {
  async register(data: RegisterInput, res: Response) {
    const existingUser = await authRepository.findByEmail(data);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return tokenService.sendTokens({
      res,
      userId: user.id,
      role: user.role,
    });
  }

  async login(data: LoginInput, res: Response) {
    const user = await authRepository.findByEmail(data);

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    return tokenService.sendTokens({
      res,
      userId: user.id,
      role: user.role,
    });
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken) throw new Error("No refresh token");

    const decoded: any = verifyRefreshToken(refreshToken);
    const { userId, role } = decoded;

    return tokenService.sendTokens({
      res,
      userId,
      role,
    });
  }

  async logout(userId: number) {
    await authRepository.removeRefreshToken(userId);
    return { message: "Logged out successfully" };
  }
}

export default new AuthService();
