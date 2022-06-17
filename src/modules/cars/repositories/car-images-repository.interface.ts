import { CarImageDTO } from "./dtos/car-image.dto";
import { CreateCarImageDTO } from "./dtos/create-car-image.dto";

export interface ICarImagesRepository {
  create(data: CreateCarImageDTO): Promise<CarImageDTO>;
  findById(id: string): Promise<CarImageDTO>;
  update(data: CarImageDTO): Promise<void>;
  delete(data: CarImageDTO): Promise<void>;
  truncate(): Promise<void>;
}
