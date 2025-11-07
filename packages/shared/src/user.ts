import { Role } from "@myflower/backend/src/generated/prisma/client";

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
}
