import { UserWithPasswordDTO } from "./user-with-password.dto";

export type CreateUserDTO = Omit<
  UserWithPasswordDTO,
  "id" | "isAdmin" | "createdAt" | "updatedAt"
>;
