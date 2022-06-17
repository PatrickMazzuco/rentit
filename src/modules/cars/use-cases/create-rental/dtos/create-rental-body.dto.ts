import { RentalDTO } from "@modules/cars/dtos/rental.dto";
import { PickType } from "@nestjs/swagger";

export class CreateRentalBodyDTO extends PickType(RentalDTO, [
  "expectedReturnDate",
  "carId",
]) {}
