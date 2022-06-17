import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

export function SingleFileUploadEndpoint(name: string) {
  return applyDecorators(
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          [name]: {
            type: "string",
            format: "binary",
          },
        },
      },
    }),
    UseInterceptors(FileInterceptor(name)),
  );
}

export function MultiFileUploadEndpoint(name: string) {
  return applyDecorators(
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          [name]: {
            type: "string",
            format: "binary",
          },
        },
      },
    }),
    UseInterceptors(FilesInterceptor(`${name}`)),
  );
}
