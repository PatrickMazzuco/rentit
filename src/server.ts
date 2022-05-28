import { apiPrefix, port } from "@config/dotenv";
import "express-async-errors";
import express from "express";

import { errorHandler } from "./middlewares/error-handler.middleware";
import { RegisterRoutes } from "./routes/routes";

const server = express();

server.use(express.json());

RegisterRoutes(server);

server.use(errorHandler);

server.get(`${apiPrefix}/status`, (_req, res) => {
  res.json({
    status: "OK",
  });
});
export const expressServer: express.Express = server;

export const startHttpServer = (callback?: () => void) =>
  server.listen(port, callback);
