import { Response } from "express";
import { LoginResponse } from "@myflower/shared";
import { authRepository } from "./auth.repository.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { SendTokensInput } from "./auth.schema.js";

class TokenService {
  private refreshCookieName = "refreshToken";

  private cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  generateTokens(payload: object) {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async sendTokens(input: SendTokensInput): Promise<LoginResponse> {
    const { res, userId, role } = input;
    const payload = { id: userId, role };

    const { accessToken, refreshToken } = this.generateTokens(payload);

    await authRepository.saveRefreshToken(userId, refreshToken);

    res.cookie(this.refreshCookieName, refreshToken, this.cookieOptions);

    return {
      accessToken,
    };
  }

  async clearTokens(res: Response, userId: number) {
    await authRepository.removeRefreshToken(userId);

    res.clearCookie(this.refreshCookieName, {
      path: "/",
    });
  }
}

export const tokenService = new TokenService();
