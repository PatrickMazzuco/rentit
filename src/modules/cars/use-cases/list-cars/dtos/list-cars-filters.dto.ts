import { CarDTO } from "@modules/cars/dtos/car.dto";
import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class PartialCarsFilters extends PickType(CarDTO, [
  "name",
  "description",
  "licensePlate",
  "brand",
  "categoryId",
]) {}

export class ListCarsFiltersDTO extends PartialType(PartialCarsFilters) {
  @ApiPropertyOptional({
    default: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === "true")
  @IsOptional()
  available?: boolean;
}
