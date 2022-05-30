export enum SortingOrder {
  ASC = "asc",
  DESC = "desc",
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

export enum TargetSortingOrder {
  ASC = "asc",
  DESC = "desc",
}

export function translateSortingOrder(order: SortingOrder): TargetSortingOrder {
  switch (order) {
    case SortingOrder.ASC:
    case SortingOrder.ASCENDING:
      return TargetSortingOrder.ASC;
    case SortingOrder.DESC:
    case SortingOrder.DESCENDING:
      return TargetSortingOrder.DESC;
    default:
      return undefined;
  }
}
