import { OmitType } from "@nestjs/swagger";
import { PaginationOptions } from "@shared/decorators/pagination/pagination-filters.decorator";

import { ListUserRentalsQueryDTO } from "./list-user-rentals-query.dto";

export class ListUserRentalsDTO extends OmitType(ListUserRentalsQueryDTO, [
  "_limit",
  "_page",
]) {
  paginationOptions: Omit<PaginationOptions, "url">;
  userId: string;
}
