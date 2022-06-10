import { CarDTO } from "@modules/cars/dtos/car.dto";
import { ICarsRepository } from "@modules/cars/repositories/cars-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import {
  TargetSortingOrder,
  translateSortingOrder,
} from "@shared/enums/sorting-order.enum";

import { ListCarsDTO } from "./dtos/list-cars.dto";

@Injectable()
export class ListCarsService {
  constructor(
    @Inject(RepositoryToken.CARS_REPOSITORY)
    private readonly carsRepository: ICarsRepository,
  ) {}

  async execute({
    paginationOptions,
    _sort: sort,
    _order,
    ...filters
  }: ListCarsDTO): Promise<ListAndCountDTO<CarDTO>> {
    const order: TargetSortingOrder = translateSortingOrder(_order);

    const cars = await this.carsRepository.list(
      {
        limit: paginationOptions.limit,
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        sort,
        order,
      },
      filters,
    );

    return cars;
  }
}
