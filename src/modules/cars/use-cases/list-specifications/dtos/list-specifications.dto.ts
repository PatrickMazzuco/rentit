import { PaginationOptions } from "@decorators/pagination/pagination-filters.decorator";

import { ListSpecificationsQueryDTO } from "./list-specifications-query.dto";

export class ListSpecificationsDTO extends ListSpecificationsQueryDTO {
  paginationOptions: Omit<PaginationOptions, "url">;
}
