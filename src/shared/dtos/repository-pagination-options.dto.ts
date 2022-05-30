import { TargetSortingOrder } from "@shared/enums/sorting-order.enum";

export class RepositoryPaginationOptions<SortType> {
  limit: number;
  skip: number;
  sort: SortType;
  order: TargetSortingOrder;
}
