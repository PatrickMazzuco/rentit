import { CategoryDTO } from "@modules/cars/dtos/category.dto";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { paginate } from "@shared/adapters/pagination";
import { PaginationAdapterDTO } from "@shared/adapters/pagination/dtos/pagination-adapter.dto";
import { ApiPaginatedResponse } from "@shared/decorators/pagination/api-paginated-response.decorator";
import {
  PaginationFilters,
  PaginationOptions,
} from "@shared/decorators/pagination/pagination-filters.decorator";
import { Request } from "express";

import { ListCategoriesQueryDTO } from "./dtos/list-categories-query.dto";
import { ListCategoriesService } from "./list-categories.service";

@ApiTags("categories")
@Controller("categories")
export class ListCategoriesController {
  constructor(private readonly listCategoriesService: ListCategoriesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
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
