import { CarDTO } from "../dtos/car.dto";
import { CreateCarDTO } from "./dtos/create-car.dto";

export interface ICarsRepository {
  create(data: CreateCarDTO): Promise<CarDTO>;
  findById(id: string): Promise<CarDTO>;
  findByLicensePlate(licensePlate: string): Promise<CarDTO>;
  truncate(): Promise<void>;
}
