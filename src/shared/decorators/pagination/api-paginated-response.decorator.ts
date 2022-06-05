/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyDecorators, Type } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from "@nestjs/swagger";
import { PaginationAdapterDTO } from "@shared/adapters/pagination/dtos/pagination-adapter.dto";

type ResponseOptions<T> = {
  type: T;
} & ApiResponseOptions;

export const ApiPaginatedResponse = <T extends Type<any>>({
  type,
  ...options
}: ResponseOptions<T>) => {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationAdapterDTO) },
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};
