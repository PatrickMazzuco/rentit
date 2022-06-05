import { CreateUserDTO } from "./dtos/create-user.dto";
import { UserWithPasswordDTO } from "./dtos/user-with-password.dto";
import { UserDTO } from "./dtos/user.dto";

export interface IUsersRepository {
  create(data: CreateUserDTO): Promise<UserDTO>;
  findById(id: string): Promise<UserDTO | null>;
  findByUsername(username: string): Promise<UserWithPasswordDTO | null>;
  findByEmail(email: string): Promise<UserWithPasswordDTO | null>;
  update(data: UserDTO): Promise<void>;
  truncate(): Promise<void>;
}
