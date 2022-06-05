import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import { ISpecificationsRepository } from "@modules/cars/repositories/specifications-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import {
  TargetSortingOrder,
  translateSortingOrder,
} from "@shared/enums/sorting-order.enum";

import { ListSpecificationsDTO } from "./dtos/list-specifications.dto";

@Injectable()
export class ListSpecificationsService {
  constructor(
    @Inject(RepositoryToken.SPECIFICATIONS_REPOSITORY)
    private readonly specificationsRepository: ISpecificationsRepository,
  ) {}

  public async execute({
    paginationOptions,
    _sort: sort,
    _order,
  }: ListSpecificationsDTO): Promise<ListAndCountDTO<SpecificationDTO>> {
    const order: TargetSortingOrder = translateSortingOrder(_order);

    const specifications = await this.specificationsRepository.list({
      limit: paginationOptions.limit,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      sort,
      order,
    });

    return specifications;
  }
}
