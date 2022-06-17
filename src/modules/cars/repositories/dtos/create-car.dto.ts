import { CarDTO } from "./car.dto";

export type CreateCarDTO = Pick<
  CarDTO,
  | "name"
  | "description"
  | "licensePlate"
  | "brand"
  | "dailyRate"
  | "fineAmount"
  | "available"
  | "categoryId"
>;
