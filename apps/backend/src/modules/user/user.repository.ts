import { UserUpdateData } from "@myflower/shared";
import prisma from "../../prisma/prisma.service.js";
import { UserUpdatePrismaData } from "./user.shema.js";

export const userRepository = {
  findUserById: async (userId: number) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  },
  changeUserDetails(userId: number, data: UserUpdatePrismaData) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true },
    });
  },

  findUserWithPassword(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });
  },
};
