import { RentalDTO } from "../dtos/rental.dto";
import { CreateRentalDTO } from "./dtos/create-rental.dto";

export interface IRentalsRepository {
  create(data: CreateRentalDTO): Promise<RentalDTO>;
  findById(id: string): Promise<RentalDTO>;
  findOneByCarId(carId: string): Promise<RentalDTO>;
  findOneByUserId(userId: string): Promise<RentalDTO>;
  truncate(): Promise<void>;
}
