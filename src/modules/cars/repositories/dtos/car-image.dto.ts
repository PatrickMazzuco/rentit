import { CarDTO } from "./car.dto";

export type CarImageDTO = {
  id: string;
  description: string;
  image: string;
  carId: string;
  car?: CarDTO;
  createdAt: Date;
  updatedAt: Date;
};
