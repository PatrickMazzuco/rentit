import { UserDTO } from "@modules/accounts/dtos/user.dto";

export class ReturnRentedCarDTO {
  rentalId: string;
  user: UserDTO;
}
