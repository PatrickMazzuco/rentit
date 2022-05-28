import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { getEnvVariables } from "./config/env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  const { port, apiPrefix } = getEnvVariables();

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port, () => {
    logger.log(`Application is running on port ${port}`);
  });
}

bootstrap();
