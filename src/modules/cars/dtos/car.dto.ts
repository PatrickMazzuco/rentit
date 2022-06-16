import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  IsOptional,
} from "class-validator";

import { CategoryDTO } from "../repositories/dtos/category.dto";
import { SpecificationDTO } from "./specification.dto";

export class CarDTO {
  @IsUUID("4")
  @IsNotEmpty()
  @ApiProperty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  brand: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  dailyRate: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  fineAmount: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  available: boolean;

  @IsUUID("4")
  @IsOptional()
  @ApiProperty()
  categoryId?: string;

  @ApiProperty()
  category?: CategoryDTO;

  @ApiProperty({ isArray: true })
  specifications?: SpecificationDTO[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
