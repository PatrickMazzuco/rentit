import { CarDTO } from "@modules/cars/dtos/car.dto";
import { PickType } from "@nestjs/swagger";

export class CreateCarDTO extends PickType(CarDTO, [
  "name",
  "description",
  "licensePlate",
  "brand",
  "dailyRate",
  "fineAmount",
  "categoryId",
]) {}
