import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { ICategoriesRepository } from "@modules/cars/repositories/categories-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import { ListAndCountDTO } from "@shared/dtos/list-and-count.dto";
import { RepositoryToken } from "@shared/enums/repository-tokens.enum";
import {
  TargetSortingOrder,
  translateSortingOrder,
} from "@shared/enums/sorting-order.enum";

import { ListCategoriesDTO } from "./dtos/list-categories.dto";

@Injectable()
export class ListCategoriesService {
  constructor(
    @Inject(RepositoryToken.CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: ICategoriesRepository,
  ) {}

  public async execute({
    paginationOptions,
    _sort: sort,
    _order,
  }: ListCategoriesDTO): Promise<ListAndCountDTO<CategoryDTO>> {
    const order: TargetSortingOrder = translateSortingOrder(_order);

    const categories = await this.categoriesRepository.list({
      limit: paginationOptions.limit,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      sort,
      order,
    });

    return categories;
  }
}
