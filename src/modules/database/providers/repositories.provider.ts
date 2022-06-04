import { PrismaUsersRepository } from "@modules/accounts/repositories/prisma/prisma-users.repository";
import { PrismaCategoriesRepository } from "@modules/cars/repositories/prisma/prisma-categories.repository";
import { PrismaSpecificationsRepository } from "@modules/cars/repositories/prisma/prisma-specifications.repository";
import { Provider } from "@nestjs/common";

import { RepositoryToken } from "../../../shared/repository-tokens.enum";

export const CategoriesRepositoryProvider: Provider = {
  provide: RepositoryToken.CATEGORIES_REPOSITORY,
  useClass: PrismaCategoriesRepository,
};

export const SpecificationsRepositoryProvider: Provider = {
  provide: RepositoryToken.SPECIFICATIONS_REPOSITORY,
  useClass: PrismaSpecificationsRepository,
};

export const UsersRepositoryProvider: Provider = {
  provide: RepositoryToken.USERS_REPOSITORY,
  useClass: PrismaUsersRepository,
};
