import { apiPrefix, port } from "@config/dotenv";
import "express-async-errors";
import express from "express";

import { errorHandler } from "./middlewares/error-handler.middleware";
import router from "./routes";

const server = express();

server.use(express.json());

server.use(apiPrefix, router);
server.use(errorHandler);

server.get("status", (req, res) => {
  res.json({
    status: "OK",
  });
});

export const startHttpServer = (callback?: () => void) =>
  server.listen(port, callback);
