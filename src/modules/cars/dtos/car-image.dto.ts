import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNotEmpty, IsString } from "class-validator";

import { CarDTO } from "./car.dto";

export class CarImageDTO {
  @IsUUID("4")
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @ApiProperty()
  carId: string;

  @ApiProperty()
  car?: CarDTO;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
