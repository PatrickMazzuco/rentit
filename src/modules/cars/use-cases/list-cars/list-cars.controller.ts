import { CarDTO } from "@modules/cars/dtos/car.dto";
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

import { ListCarsQueryDTO } from "./dtos/list-cars-query.dto";
import { ListCarsService } from "./list-cars.service";

@ApiTags("cars")
@Controller("cars")
export class ListCarsController {
  constructor(private readonly listCarsService: ListCarsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse({
    description: "Cars listed successfully",
    type: CarDTO,
  })
  async handle(
    @PaginationFilters() paginationOptions: PaginationOptions,
    @Query() query: ListCarsQueryDTO,
    @Req() request: Request,
  ): Promise<PaginationAdapterDTO<CarDTO>> {
    const { _order, _sort } = query;

    const { count, data } = await this.listCarsService.execute({
      paginationOptions,
      _order,
      _sort,
      ...query,
    });

    const paginatedData = paginate<CarDTO>({
      data,
      totalItems: count,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      request,
    });

    return paginatedData;
  }
}
