import { PaginationFiltersDTO } from "@adapters/pagination/dtos/pagination-filters.dto";
import { SpecificationSortingFields } from "@modules/cars/enums/specification-sorting-fields.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";

export class ListSpecificationsQueryDTO extends PaginationFiltersDTO {
  @ApiPropertyOptional({
    enum: SpecificationSortingFields,
    default: SpecificationSortingFields.NAME,
  })
  @IsOptional()
  @IsEnum(SpecificationSortingFields)
  _sort?: SpecificationSortingFields;
}
