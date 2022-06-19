import { RentalSortingFields } from "@modules/rentals/enums/rental-sorting-fields.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationFiltersDTO } from "@shared/adapters/pagination/dtos/pagination-filters.dto";
import { SortingOrder } from "@shared/enums/sorting-order.enum";
import { IsOptional, IsEnum } from "class-validator";

export class ListUserRentalsQueryDTO extends PaginationFiltersDTO {
  @ApiPropertyOptional({
    enum: RentalSortingFields,
    default: RentalSortingFields.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(RentalSortingFields)
  _sort?: RentalSortingFields;

  @ApiPropertyOptional({ enum: SortingOrder, default: SortingOrder.DESC })
  _order?: SortingOrder;
}
