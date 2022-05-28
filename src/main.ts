import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { getEnvVariables } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { port, apiPrefix } = getEnvVariables();

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port || 3030);
}
bootstrap();
