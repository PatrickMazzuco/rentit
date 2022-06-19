import { IRentalsRepository } from "@modules/rentals/repositories/rentals-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import {
  TargetSortingOrder,
  translateSortingOrder,
} from "@shared/enums/sorting-order.enum";

import { ListUserRentalsResponseDTO } from "./dtos/list-user-rentals-response.dto";
import { ListUserRentalsDTO } from "./dtos/list-user-rentals.dto";

@Injectable()
export class ListUserRentalsService {
  constructor(
    @Inject(RepositoryToken.RENTALS_REPOSITORY)
    private readonly rentalsRepository: IRentalsRepository,
  ) {}

  async execute({
    paginationOptions,
    _sort: sort,
    _order,
    ...filters
  }: ListUserRentalsDTO): Promise<ListAndCountDTO<ListUserRentalsResponseDTO>> {
    const order: TargetSortingOrder = translateSortingOrder(_order);

    const userRentals = await this.rentalsRepository.list(
      {
        limit: paginationOptions.limit,
        skip: (paginationOptions.page - 1) * paginationOptions.limit,
        sort,
        order,
      },
      filters,
    );

    const dataWithoutUser = userRentals.data.map((rental) => {
      const { user: _user, ...data } = rental;
      return data;
    });

    return {
      data: dataWithoutUser,
      count: userRentals.count,
    };
  }
}
