import { Request } from "express";

import { PaginationAdapterDTO } from "./dtos/pagination-adapter.dto";

interface IPaginationOptions<T> {
  page: number;
  limit: number;
  data: T[];
  totalItems: number;
  request: Request;
}

function parseQuery(query: { [key: string]: unknown }) {
  return Object.keys(query)
    .map((queryKey) => `${queryKey}=${query[queryKey]}`)
    .join("&");
}

export function paginate<T>({
  data,
  limit,
  totalItems,
  page,
  request,
}: IPaginationOptions<T>): PaginationAdapterDTO<T> {
  const host = `${request.protocol}://${request.get("host")}${request.path}`;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _page, ...query } = request.query;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const filter = parseQuery(query);

  const links = {
    first: `${host}?_page=1${filter ? `&${filter}` : ""}`,
    last: `${host}?_page=${Math.ceil(totalItems / limit)}${
      filter ? `&${filter}` : ""
    }`,
  };

  if (endIndex < totalItems) {
    Object.assign(links, {
      next: `${host}?_page=${page + 1}${filter ? `&${filter}` : ""}`,
    });
  }

  if (startIndex > 0) {
    Object.assign(links, {
      previous: `${host}?_page=${page - 1}${filter ? `&${filter}` : ""}`,
    });
  }

  return {
    data,
    meta: {
      itemCount: data.length,
      totalItems,
      itemsPerPage: Number(limit),
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
    links,
  };
}
