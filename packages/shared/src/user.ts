enum Role {
  "USER",
  "ADMIN",
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
}
