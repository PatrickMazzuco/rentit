import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { Request } from "express";

export class UserRequest extends Request {
  user: UserDTO;
}
