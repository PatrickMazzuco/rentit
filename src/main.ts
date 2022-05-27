import "reflect-metadata";
import "@shared/container";
import { port } from "./config/dotenv";
import { startHttpServer } from "./server";

startHttpServer(() => {
  console.log(`Server is running on port ${port}`);
});
