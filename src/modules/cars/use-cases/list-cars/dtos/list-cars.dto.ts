import { OmitType } from "@nestjs/swagger";
import { PaginationOptions } from "@shared/decorators/pagination/pagination-filters.decorator";

import { ListCarsQueryDTO } from "./list-cars-query.dto";

export class ListCarsDTO extends OmitType(ListCarsQueryDTO, [
  "_limit",
  "_page",
]) {
  paginationOptions: Omit<PaginationOptions, "url">;
}
