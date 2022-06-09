import { CarDTO } from "./car.dto";

export type CreateCarDTO = Omit<
  CarDTO,
  "id" | "category" | "createdAt" | "updatedAt"
>;
