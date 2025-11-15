import { userRepository } from "./user.repository.js";
import { Response } from "express";
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
}

export default new UserService();
