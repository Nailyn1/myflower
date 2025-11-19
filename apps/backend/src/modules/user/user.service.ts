import { UserUpdateData } from "@myflower/shared";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { userRepository } from "./user.repository.js";
import { Response } from "express";
import { UserUpdatePrismaData } from "./user.shema.js";

class UserService {
  async getUserById(userId: number, res: Response) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the provided ID was not found" });
    }

    return res.status(201).json({ message: "The user has been found", user });
  }

  async updateUser(userId: number, data: UserUpdateData, res: Response) {
    const user = await userRepository.findUserWithPassword(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let passwordUpdated = false;
    let profileUpdated = false;
    let updatedUser: UserUpdatePrismaData | null = null;

    if (data.oldPassword && data.newPassword) {
      const isValid = await comparePassword(data.oldPassword, user.password);

      if (!isValid) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const hashedPassword = await hashPassword(data.newPassword);

      await userRepository.changeUserDetails(userId, {
        password: hashedPassword,
      });

      passwordUpdated = true;
    }

    if (data.name || data.email) {
      try {
        updatedUser = await userRepository.changeUserDetails(userId, {
          name: data.name,
          email: data.email,
        });
      } catch (err: any) {
        if (err.code === "P2002" && err.meta?.target?.includes("email")) {
          return res.status(400).json({ message: "Email already exists" });
        }
        throw err;
      }

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      profileUpdated = true;
    }

    if (passwordUpdated && profileUpdated) {
      return res
        .status(200)
        .json({ message: "User updated is succefully", updatedUser });
    }

    if (passwordUpdated) {
      return res.status(200).json({ message: "Password updated successfully" });
    }

    if (profileUpdated) {
      return res
        .status(200)
        .json({ message: "User updated is succefully", updatedUser });
    }

    return res.status(400).json({ message: "No valid fields provided" });
  }
}

export default new UserService();
