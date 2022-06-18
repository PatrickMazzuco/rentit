import { UserDTO } from "@modules/accounts/dtos/user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsString } from "class-validator";

import { CarDTO } from "../../cars/dtos/car.dto";

export class RentalDTO {
  @IsUUID("4")
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  endDate?: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  total?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  expectedReturnDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  carId: string;

  @ApiProperty()
  car: CarDTO;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @ApiProperty()
  user: UserDTO;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
