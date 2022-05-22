import { ICategoriesRepository } from "@src/modules/cars/repositories/categories-repository.interface";
import { PrismaCategoriesRepository } from "@src/modules/cars/repositories/prisma/prisma-categories.repository";
import { container } from "tsyringe";

import { RepositoryToken } from "./repository-tokens.enum";

container.registerSingleton<ICategoriesRepository>(
  RepositoryToken.CATEGORIES_REPOSITORY,
  PrismaCategoriesRepository,
);

export * from "./repository-tokens.enum";
