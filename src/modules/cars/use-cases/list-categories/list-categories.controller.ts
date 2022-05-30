import { paginate } from "@adapters/pagination";
import { PaginationAdapterDTO } from "@adapters/pagination/dtos/pagination-adapter.dto";
import { ApiPaginatedResponse } from "@decorators/pagination/api-paginated-response.decorator";
import {
  PaginationFilters,
  PaginationOptions,
} from "@decorators/pagination/pagination-filters.decorator";
import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import { Controller, Get, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { ListCategoriesQueryDTO } from "./dtos/list-categories-query.dto";
import { ListCategoriesService } from "./list-categories.service";

@ApiTags("categories")
@Controller("categories")
export class ListCategoriesController {
  constructor(private readonly listCategoriesService: ListCategoriesService) {}

  @Get()
  @ApiPaginatedResponse({
    description: "Categories listed successfully",
    type: CategoryDTO,
  })
  async handle(
    @PaginationFilters() paginationOptions: PaginationOptions,
    @Query() query: ListCategoriesQueryDTO,
    @Req() request: Request,
  ): Promise<PaginationAdapterDTO<CategoryDTO>> {
    const { _order, _sort } = query;

    const { count, data } = await this.listCategoriesService.execute({
      paginationOptions,
      _order,
      _sort,
    });

    const paginatedData = paginate<CategoryDTO>({
      data,
      totalItems: count,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      request,
    });

    return paginatedData;
  }
}
