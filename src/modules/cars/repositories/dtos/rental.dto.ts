import { UserDTO } from "@modules/accounts/dtos/user.dto";

import { CarDTO } from "./car.dto";

export type RentalDTO = {
  id: string;
  startDate: Date;
  endDate?: Date;
  total?: number;
  expectedReturnDate: Date;
  carId: string;
  car: CarDTO;
  userId: string;
  user: UserDTO;
  createdAt: Date;
  updatedAt: Date;
};
