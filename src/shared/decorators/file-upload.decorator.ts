import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

export function FileUploadEndpoint(name: string) {
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
