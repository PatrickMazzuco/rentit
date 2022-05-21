import { apiPrefix, port } from "@config/dotenv";
import express from "express";

import router from "./routes";

const server = express();

server.use(express.json());
server.use(apiPrefix, router);

server.get("", (req, res) => {
  res.json({
    message: "Hello World!",
    status: 200,
  });
});

export const startHttpServer = () =>
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
