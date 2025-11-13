import prisma from "../../prisma/prisma.service.js";
import { verifyRefreshToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { authRepository } from "./auth.repository.js";
import { DecodedType, LoginInput, RegisterInput } from "./auth.schema.js";
import { tokenService } from "./token.service.js";
import { Response } from "express";

class AuthService {
  async register(data: RegisterInput, res: Response) {
    const { email } = data;

    const existingUser = await authRepository.findByEmail(email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    const tokens = await tokenService.sendTokens({
      res,
      userId: user.id,
      role: user.role,
    });
    return res
      .status(201)
      .json({ message: "User successfully registered", ...tokens });
  }

  async login(data: LoginInput, res: Response) {
    const { email } = data;
    const user = await authRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "User does not exists" });
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const tokens = await tokenService.sendTokens({
      res,
      userId: user.id,
      role: user.role,
    });

    return res
      .status(201)
      .json({ message: "Log in is succesfully", ...tokens });
  }

  async refresh(refreshToken: string, res: Response) {
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { id, role } = decoded as DecodedType;

    const tokens = await tokenService.sendTokens({
      res,
      userId: id,
      role,
    });
    console.log("tokens:", tokens);
    return res
      .status(201)
      .json({ message: "RefreshToken is succesfully", ...tokens });
  }

  async logout(id: number, res: Response) {
    await authRepository.removeRefreshToken(id);
    await tokenService.clearTokens(res, id);
    return res.status(201).json({ message: "Logout is succesfully" });
  }
}

export default new AuthService();
