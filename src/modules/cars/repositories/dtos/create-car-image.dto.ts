import { CarImageDTO } from "./car-image.dto";

export type CreateCarImageDTO = Pick<
  CarImageDTO,
  "description" | "image" | "carId"
>;
