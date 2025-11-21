import { UserUpdateData } from "@myflower/shared";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: User["role"];
      };
      validatedData?: UserUpdateData;
      idempotencyKey?: string;
    }
  }
}
