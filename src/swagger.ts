import { Express, Response as ExResponse, Request as ExRequest } from "express";
import swaggerUi from "swagger-ui-express";

import { apiPrefix } from "./config/dotenv";
import { generateSwaggerSpec } from "./config/tsoa";

export const initializeSwagger = async (server: Express) => {
  await generateSwaggerSpec();

  server.use(
    `${apiPrefix}/docs`,
    swaggerUi.serve,
    async (_req: ExRequest, res: ExResponse) => {
      return res.send(
        swaggerUi.generateHTML(await import("@src/routes/swagger.json")),
      );
    },
  );
};
