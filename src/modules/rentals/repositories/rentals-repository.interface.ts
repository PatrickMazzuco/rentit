import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";

import { RentalSortingFields } from "../enums/rental-sorting-fields.enum";
import { CreateRentalDTO } from "./dtos/create-rental.dto";
import { RentalFiltersDTO } from "./dtos/rental-filters.dto";
import { RentalDTO } from "./dtos/rental.dto";

export interface IRentalsRepository {
  create(data: CreateRentalDTO): Promise<RentalDTO>;
  findById(id: string): Promise<RentalDTO>;
  findOneActiveByCarId(carId: string): Promise<RentalDTO>;
  findOneActiveByUserId(userId: string): Promise<RentalDTO>;
  list(
    options: RepositoryPaginationOptions<RentalSortingFields>,
    filters: RentalFiltersDTO,
  ): Promise<ListAndCountDTO<RentalDTO>>;
  update(data: RentalDTO): Promise<void>;
  delete(data: RentalDTO): Promise<void>;
  truncate(): Promise<void>;
}
