import "reflect-metadata";
import "@shared/container";
import { port } from "./config/dotenv";
import { initializeRoutes } from "./config/tsoa";
import { expressServer, startHttpServer } from "./server";
import { initializeSwagger } from "./swagger";

(async () => {
  await initializeRoutes();
  await initializeSwagger(expressServer);
  startHttpServer(() => {
    console.log(`Server is running on port ${port}`);
  });
})();
