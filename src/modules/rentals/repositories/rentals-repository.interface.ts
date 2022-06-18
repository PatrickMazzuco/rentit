import { CreateRentalDTO } from "./dtos/create-rental.dto";
import { RentalDTO } from "./dtos/rental.dto";

export interface IRentalsRepository {
  create(data: CreateRentalDTO): Promise<RentalDTO>;
  findById(id: string): Promise<RentalDTO>;
  findOneActiveByCarId(carId: string): Promise<RentalDTO>;
  findOneActiveByUserId(userId: string): Promise<RentalDTO>;
  update(data: RentalDTO): Promise<void>;
  delete(data: RentalDTO): Promise<void>;
  truncate(): Promise<void>;
}
