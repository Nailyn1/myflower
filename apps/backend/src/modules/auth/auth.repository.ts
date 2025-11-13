import { RegisterInput } from "./auth.schema.js";
import prisma from "../../prisma/prisma.service.js";
export const authRepository = {
  createUser: async (data: RegisterInput) => {
    return prisma.user.create({ data });
  },

  findByEmail: async (email: string) => {
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
};
