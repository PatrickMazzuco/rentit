import { PrismaCategoriesRepository } from "@modules/cars/repositories/prisma/prisma-categories.repository";
import { Provider } from "@nestjs/common";

import { RepositoryToken } from "../../../shared/repository-tokens.enum";

export const CategoriesRepositoryProvider: Provider = {
  provide: RepositoryToken.CATEGORIES_REPOSITORY,
  useClass: PrismaCategoriesRepository,
};
