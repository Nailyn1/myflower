import prisma from "../../prisma/prisma.service.js";

export const userRepository = {
  findUserById: async (userId: number) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
      },
    });
  },
};
