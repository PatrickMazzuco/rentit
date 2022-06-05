import { paginate } from "@adapters/pagination";
import { PaginationAdapterDTO } from "@adapters/pagination/dtos/pagination-adapter.dto";
import { ApiPaginatedResponse } from "@decorators/pagination/api-paginated-response.decorator";
import {
  PaginationFilters,
  PaginationOptions,
} from "@decorators/pagination/pagination-filters.decorator";
import { SpecificationDTO } from "@modules/cars/dtos/specification.dto";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { ListSpecificationsQueryDTO } from "./dtos/list-specifications-query.dto";
import { ListSpecificationsService } from "./list-specifications.service";

@ApiTags("specifications")
@Controller("specifications")
export class ListSpecificationsController {
  constructor(
    private readonly listSpecificationsService: ListSpecificationsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse({
    description: "Specifications listed successfully",
    type: SpecificationDTO,
  })
  async handle(
    @PaginationFilters() paginationOptions: PaginationOptions,
    @Query() query: ListSpecificationsQueryDTO,
    @Req() request: Request,
  ): Promise<PaginationAdapterDTO<SpecificationDTO>> {
    const { _order, _sort } = query;

    const { count, data } = await this.listSpecificationsService.execute({
      paginationOptions,
      _order,
      _sort,
    });

    const paginatedData = paginate<SpecificationDTO>({
      data,
      totalItems: count,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      request,
    });

    return paginatedData;
  }
}
