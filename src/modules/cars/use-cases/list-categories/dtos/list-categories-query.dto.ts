import { CategorySortingFields } from "@modules/cars/enums/category-sorting-fields.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationFiltersDTO } from "@shared/adapters/pagination/dtos/pagination-filters.dto";
import { IsOptional, IsEnum } from "class-validator";

export class ListCategoriesQueryDTO extends PaginationFiltersDTO {
  @ApiPropertyOptional({
    enum: CategorySortingFields,
    default: CategorySortingFields.NAME,
  })
  @IsOptional()
  @IsEnum(CategorySortingFields)
  _sort?: CategorySortingFields;
}
