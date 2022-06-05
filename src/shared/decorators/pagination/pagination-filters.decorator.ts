import { getEnvPaginationOptions } from "@config/env";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export type PaginationOptions = {
  limit: number;
  page: number;
};

export const PaginationFilters = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationOptions => {
    const request: Request = ctx.switchToHttp().getRequest();
    const paginationOptions = getEnvPaginationOptions();

    const { _page, _limit } = request.query;

    const limit = Number(_limit) || paginationOptions.defaultPaginationLimit;
    const page = Number(_page) || 1;

    return {
      limit,
      page,
    };
  },
);
