import { PaginationOptions } from "@shared/decorators/pagination/pagination-filters.decorator";

import { ListCategoriesQueryDTO } from "./list-categories-query.dto";

export class ListCategoriesDTO extends ListCategoriesQueryDTO {
  paginationOptions: Omit<PaginationOptions, "url">;
}
