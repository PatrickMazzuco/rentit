import { CarSortingFields } from "@modules/cars/enums/car-sorting-fields.enum";
import { ApiPropertyOptional, IntersectionType } from "@nestjs/swagger";
import { PaginationFiltersDTO } from "@shared/adapters/pagination/dtos/pagination-filters.dto";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { IsOptional, IsEnum } from "class-validator";

import { ListCarsFiltersDTO } from "./list-cars-filters.dto";

export class ListCarsQueryDTO extends IntersectionType(
  PaginationFiltersDTO,
  ListCarsFiltersDTO,
) {
  @ApiPropertyOptional({
    enum: CarSortingFields,
    default: CarSortingFields.NAME,
  })
  @IsOptional()
  @IsEnum(CarSortingFields)
  _sort?: CarSortingFields;

  @ApiPropertyOptional({ enum: SortingOrder, default: SortingOrder.ASC })
  _order?: SortingOrder;
}
