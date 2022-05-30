import { getEnvPaginationOptions } from "@config/env";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, Max, Min } from "class-validator";

const paginationOptions = getEnvPaginationOptions();

export class PaginationFiltersDTO {
  @ApiPropertyOptional({
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  _page?: number;

  @ApiPropertyOptional({
    default: paginationOptions.defaultPaginationLimit,
    maximum: paginationOptions.maxPaginationLimit,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(paginationOptions.maxPaginationLimit)
  @Type(() => Number)
  _limit?: number;

  @ApiPropertyOptional({ enum: SortingOrder, default: SortingOrder.DESCENDING })
  @IsOptional()
  @IsEnum(SortingOrder)
  _order?: SortingOrder;

  @IsOptional()
  @ApiPropertyOptional()
  _sort?: string;
}
