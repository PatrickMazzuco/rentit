import { UserDTO } from "@modules/accounts/dtos/user.dto";
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
import { AuthUser } from "@shared/decorators/auth-user.decorator";
import { JWTAuthGuard } from "@shared/decorators/jwt-auth-guard.decorator";
import { ApiPaginatedResponse } from "@shared/decorators/pagination/api-paginated-response.decorator";
import {
  PaginationFilters,
  PaginationOptions,
} from "@shared/decorators/pagination/pagination-filters.decorator";
import { Request } from "express";

import { ListUserRentalsQueryDTO } from "./dtos/list-user-rentals-query.dto";
import { ListUserRentalsResponseDTO } from "./dtos/list-user-rentals-response.dto";
import { ListUserRentalsService } from "./list-user-rentals.service";

@ApiTags("rentals")
@Controller("rentals")
@JWTAuthGuard()
export class ListUserRentalsController {
  constructor(
    private readonly listUserRentalsService: ListUserRentalsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse({
    description: "Rentals listed successfully",
    type: ListUserRentalsResponseDTO,
  })
  async handle(
    @PaginationFilters() paginationOptions: PaginationOptions,
    @Query() query: ListUserRentalsQueryDTO,
    @Req() request: Request,
    @AuthUser() { id }: UserDTO,
  ): Promise<PaginationAdapterDTO<ListUserRentalsResponseDTO>> {
    const { _order, _sort } = query;

    const { count, data } = await this.listUserRentalsService.execute({
      userId: id,
      paginationOptions,
      _order,
      _sort,
      ...query,
    });

    const paginatedData = paginate<ListUserRentalsResponseDTO>({
      data,
      totalItems: count,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      request,
    });

    return paginatedData;
  }
}
