import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryPaginationOptions } from "@shared/dtos/repository-pagination-options.dto";

import { CarDTO } from "../dtos/car.dto";
import { CarSortingFields } from "../enums/car-sorting-fields.enum";
import { CarFiltersDTO } from "./dtos/car-filters.dto";
import { CreateCarDTO } from "./dtos/create-car.dto";

export interface ICarsRepository {
  create(data: CreateCarDTO): Promise<CarDTO>;
  findById(id: string): Promise<CarDTO>;
  findByLicensePlate(licensePlate: string): Promise<CarDTO>;
  list(
    options: RepositoryPaginationOptions<CarSortingFields>,
    filters: CarFiltersDTO,
  ): Promise<ListAndCountDTO<CarDTO>>;
  update(data: CarDTO): Promise<void>;
  truncate(): Promise<void>;
}
