import { LoginInput, RegisterInput } from "./auth.schema.js";
import prisma from "../../prisma/prisma.service.js";

export const authRepository = {
  createUser: async (data: RegisterInput) => {
    return prisma.user.create({ data });
  },

  findByEmail: async (data: LoginInput) => {
    const { email } = data;
    return prisma.user.findUnique({ where: { email } });
  },

  saveRefreshToken: async (userId: number, refreshToken: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  },

  removeRefreshToken(userId: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },

  updateRefreshToken(userId: number, refreshToken: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  },
};
