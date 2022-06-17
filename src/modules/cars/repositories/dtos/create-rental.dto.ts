import { RentalDTO } from "./rental.dto";

export type CreateRentalDTO = Pick<
  RentalDTO,
  "startDate" | "endDate" | "total" | "expectedReturnDate" | "carId" | "userId"
>;
