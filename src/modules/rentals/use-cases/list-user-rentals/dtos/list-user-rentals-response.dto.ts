import { RentalDTO } from "@modules/rentals/dtos/rental.dto";
import { OmitType } from "@nestjs/swagger";

export class ListUserRentalsResponseDTO extends OmitType(RentalDTO, ["user"]) {}
