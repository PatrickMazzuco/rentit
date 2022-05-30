import { INestApplication } from "@nestjs/common";

import { AllExceptionsFilter } from "../exceptions.filter";
import { ClassValidatorPipe } from "../validation.pipe";

interface IGlobalSetupOptions {
  app: INestApplication;
}

export const setupGlobalPipes = ({ app }: IGlobalSetupOptions) => {
  app.useGlobalPipes(
    new ClassValidatorPipe({
      whitelist: true,
      transform: true,
    }),
  );
};

export const setupGlobalFilters = ({ app }: IGlobalSetupOptions) => {
  app.useGlobalFilters(new AllExceptionsFilter());
};
