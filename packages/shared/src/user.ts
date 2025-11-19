export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
}
