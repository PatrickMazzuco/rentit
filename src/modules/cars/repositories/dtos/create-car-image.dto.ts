import { CarImageDTO } from "./car-image.dto";

export type CreateCarImageDTO = Omit<
  CarImageDTO,
  "id" | "car" | "createdAt" | "updatedAt"
>;
