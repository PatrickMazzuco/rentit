import { PaginationAdapterDTO } from "@adapters/pagination/dtos/pagination-adapter.dto";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import * as packageJson from "../../package.json";

interface ISwaggerOptions {
  app: INestApplication;
  apiPrefix?: string;
}

export const setupSwagger = ({
  app,
  apiPrefix = "",
}: ISwaggerOptions): void => {
  const apiVersion = packageJson.version;

  app.setGlobalPrefix(apiPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Rentit API")
    .setDescription("Car rental application API")
    .setVersion(apiVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [PaginationAdapterDTO],
  });
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
