import { Provider } from "@nestjs/common";
import { PrismaCategoriesRepository } from "@src/modules/cars/repositories/prisma/prisma-categories.repository";

import { RepositoryToken } from "../repository-tokens.enum";

export const CategoriesRepositoryProvider: Provider = {
  provide: RepositoryToken.CATEGORIES_REPOSITORY,
  useClass: PrismaCategoriesRepository,
};
