import { UserDTO } from "./user.dto";

export type UserWithPasswordDTO = UserDTO & {
  password: string;
};
